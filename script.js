const API_URL = 'https://api.github.com/users/';
const RAW_CONTENT_URL = 'https://raw.githubusercontent.com/';
const searchBtn = document.getElementById('search-btn');
const usernameInput = document.getElementById('username');
const loadingElement = document.getElementById('loading');
const profileElement = document.getElementById('profile');

searchBtn.addEventListener('click', fetchProfile);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchProfile();
    }
});

async function fetchProfile() {
    const username = usernameInput.value.trim();
    if (!username) return;

    showLoading();

    try {
        const response = await fetch(`${API_URL}${username}`);
        if (!response.ok) throw new Error('User not found');
        const userData = await response.json();

        updateProfile(userData);
        await fetchReadme(username);
    } catch (error) {
        alert(error.message);
    } finally {
        hideLoading();
    }
}

function updateProfile(userData) {
    document.getElementById('avatar').src = userData.avatar_url;
    document.getElementById('name').textContent = userData.name || userData.login;
    document.getElementById('login').textContent = `@${userData.login}`;
    document.getElementById('pronouns').textContent = userData.pronouns || '';
    document.getElementById('bio').textContent = userData.bio || '';
    document.getElementById('followers').textContent = userData.followers;
    document.getElementById('following').textContent = userData.following;
    document.getElementById('repositories').textContent = userData.public_repos;
    document.getElementById('company').textContent = userData.company || 'Not specified';
    document.getElementById('location').textContent = userData.location || 'Not specified';
    document.getElementById('timezone').textContent = userData.timezone || 'Not specified';

    updateGitHubStats(userData.login);

    profileElement.classList.remove('hidden');
}

function updateGitHubStats(username) {
    const topLangsElement = document.getElementById('top-langs');
    const streakStatsElement = document.getElementById('streak-stats');
    const trophiesElement = document.getElementById('trophies');

    topLangsElement.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=dark&hide_border=true&include_all_commits=true&count_private=true&layout=compact`;
    streakStatsElement.src = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true`;
    trophiesElement.src = `https://github-profile-trophy.vercel.app/?username=${username}&theme=darkhub&no-frame=true&no-bg=false&margin-w=4`;
}

async function fetchReadme(username) {
    try {
        const response = await fetch(`${RAW_CONTENT_URL}${username}/${username}/main/README.md`);
        if (!response.ok) throw new Error('README not found');
        const readmeContent = await response.text();
        document.getElementById('readme-content').textContent = readmeContent;
    } catch (error) {
        console.error('Error fetching README:', error);
        document.getElementById('readme-content').textContent = 'README not available';
    }
}

function showLoading() {
    loadingElement.classList.remove('hidden');
    profileElement.classList.add('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}