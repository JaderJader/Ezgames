/* EZGames - add and save community game suggestions */
(() => {
    const STORAGE_KEY = "ezgames-community-games-v1";
    const form = document.getElementById("addGameForm");
    const grid = document.querySelector(".game-grid");
    const message = document.getElementById("formMessage");

    if (!form || !grid || !message) return;

    const genreNames = {
        horror: "Horror",
        action: "Action",
        adventure: "Adventure",
        rpg: "RPG",
        openworld: "Open World",
        survival: "Survival",
        multiplayer: "Multiplayer",
        story: "Story Rich",
        exploration: "Exploration",
        relaxing: "Relaxing",
        strategy: "Strategy",
        indie: "Indie"
    };

    function getSavedGames() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function safeImageUrl(value) {
        if (!value) return "";
        try {
            const url = new URL(value);
            return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
        } catch {
            return "";
        }
    }

    function createGameCard(game) {
        const card = document.createElement("article");
        card.className = "game-card user-game-card";
        card.dataset.tags = game.genre;

        const imageArea = document.createElement("div");
        imageArea.className = "game-image";

        const imageUrl = safeImageUrl(game.image);
        if (imageUrl) {
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = game.title;
            image.loading = "lazy";
            image.addEventListener("error", () => {
                image.remove();
                imageArea.classList.add("no-image");
                const icon = document.createElement("span");
                icon.className = "no-image-icon";
                icon.textContent = "🎮";
                imageArea.appendChild(icon);
            }, { once: true });
            imageArea.appendChild(image);
        } else {
            imageArea.classList.add("no-image");
            const icon = document.createElement("span");
            icon.className = "no-image-icon";
            icon.textContent = "🎮";
            imageArea.appendChild(icon);
        }

        const category = document.createElement("span");
        category.className = "game-category";
        category.textContent = genreNames[game.genre] || "GAME";
        imageArea.appendChild(category);

        const communityLabel = document.createElement("span");
        communityLabel.className = "user-game-label";
        communityLabel.textContent = "COMMUNITY PICK";
        imageArea.appendChild(communityLabel);

        const info = document.createElement("div");
        info.className = "game-info";

        const title = document.createElement("h3");
        title.textContent = game.title;

        const description = document.createElement("p");
        description.textContent = game.description;

        const tags = document.createElement("div");
        tags.className = "game-tags";
        const tag = document.createElement("span");
        tag.textContent = genreNames[game.genre] || "Game";
        tags.appendChild(tag);

        info.append(title, description, tags);
        card.append(imageArea, info);
        return card;
    }

    function renderSavedGames() {
        getSavedGames().forEach((game) => {
            if (game && game.title && game.description && genreNames[game.genre]) {
                grid.appendChild(createGameCard(game));
            }
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const game = {
            title: String(formData.get("title") || "").trim(),
            genre: String(formData.get("genre") || ""),
            description: String(formData.get("description") || "").trim(),
            image: safeImageUrl(String(formData.get("image") || "").trim())
        };

        if (!game.title || !game.description || !genreNames[game.genre]) {
            message.textContent = "Please complete the title, genre and description.";
            return;
        }

        const savedGames = getSavedGames();
        savedGames.push(game);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGames));
        } catch {
            message.textContent = "Could not save this game in your browser storage.";
            return;
        }

        grid.appendChild(createGameCard(game));
        form.reset();
        message.textContent = `“${game.title}” was added to EZGames!`;
        document.getElementById("results").scrollIntoView({ behavior: "smooth" });
    });

    renderSavedGames();
})();
