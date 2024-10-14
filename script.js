document.addEventListener('DOMContentLoaded', function() {
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
        const avatarEl = document.getElementById('avatar');
        const nameEl = document.getElementById('name');
        const loginEl = document.getElementById('login');
        const pronounsEl = document.getElementById('pronouns');
        const bioEl = document.getElementById('bio');
        const followersEl = document.getElementById('followers');
        const followingEl = document.getElementById('following');
        const reposEl = document.getElementById('repositories');
        const companyEl = document.getElementById('company');
        const locationEl = document.getElementById('location');
        const timezoneEl = document.getElementById('timezone');

        // Ensure all elements exist before modifying their textContent or attributes
        if (avatarEl) avatarEl.src = userData.avatar_url;
        if (nameEl) nameEl.textContent = userData.name || userData.login;
        if (loginEl) loginEl.textContent = `@${userData.login}`;
        if (pronounsEl) pronounsEl.textContent = userData.pronouns || '';
        if (bioEl) bioEl.textContent = userData.bio || '';
        if (followersEl) followersEl.textContent = userData.followers;
        if (followingEl) followingEl.textContent = userData.following;
        if (reposEl) reposEl.textContent = userData.public_repos;
        if (companyEl) companyEl.textContent = userData.company || 'Not specified';
        if (locationEl) locationEl.textContent = userData.location || 'Not specified';
        if (timezoneEl) timezoneEl.textContent = userData.timezone || 'Not specified';

        updateGitHubStats(userData.login);

        profileElement.classList.remove('hidden');
    }

    function updateGitHubStats(username) {
        const topLangsElement = document.getElementById('top-langs');
        const streakStatsElement = document.getElementById('streak-stats');
        const trophiesElement = document.getElementById('trophies');

        if (topLangsElement) {
            topLangsElement.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=dark&hide_border=true&include_all_commits=true&count_private=true&layout=compact`;
        }
        if (streakStatsElement) {
            streakStatsElement.src = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true`;
        }
        if (trophiesElement) {
            trophiesElement.src = `https://github-profile-trophy.vercel.app/?username=${username}&theme=darkhub&no-frame=true&no-bg=false&margin-w=4`;
        }
    }

    function showLoading() {
        if (loadingElement) loadingElement.classList.remove('hidden');
        if (profileElement) profileElement.classList.add('hidden');
    }

    function hideLoading() {
        if (loadingElement) loadingElement.classList.add('hidden');
    }
});
