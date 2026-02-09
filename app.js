// DOM Elements
const addPlaceForm = document.getElementById('add-place-form');
const addCountryForm = document.getElementById('add-country-form');
const placesContainer = document.getElementById('places-container');
const countriesContainer = document.getElementById('countries-container');
const loadingIndicator = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');
const placeCountBadge = document.getElementById('place-count');
const countryCountBadge = document.getElementById('country-count');
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');
const countrySelect = document.getElementById('country-select');

// Configuration - HARDCODED
const config = {
    token: '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',
    username: 'enesgzdk',
    repo: 'plan',
    path: 'places.json'
};

// Data State
let appData = {
    places: [],
    countries: []
};
let mapInstance = null;

// Country Data (ISO Alpha-2 Code, Turkish Name)
// Flags: Emoji for Select (Windows limitation accepted), CSS for List (Beautiful)
const countryList = [
    { code: "AF", name: "Afganistan", flag: "🇦🇫" },
    { code: "AL", name: "Arnavutluk", flag: "🇦🇱" },
    { code: "DZ", name: "Cezayir", flag: "🇩🇿" },
    { code: "AD", name: "Andorra", flag: "🇦🇩" },
    { code: "AO", name: "Angola", flag: "🇦🇴" },
    { code: "AR", name: "Arjantin", flag: "🇦🇷" },
    { code: "AM", name: "Ermenistan", flag: "🇦🇲" },
    { code: "AU", name: "Avustralya", flag: "🇦🇺" },
    { code: "AT", name: "Avusturya", flag: "🇦🇹" },
    { code: "AZ", name: "Azerbaycan", flag: "🇦🇿" },
    { code: "BS", name: "Bahamalar", flag: "🇧🇸" },
    { code: "BH", name: "Bahreyn", flag: "🇧🇭" },
    { code: "BD", name: "Bangladeş", flag: "🇧🇩" },
    { code: "BB", name: "Barbados", flag: "🇧🇧" },
    { code: "BY", name: "Beyaz Rusya", flag: "🇧🇾" },
    { code: "BE", name: "Belçika", flag: "🇧🇪" },
    { code: "BZ", name: "Belize", flag: "🇧🇿" },
    { code: "BJ", name: "Benin", flag: "🇧🇯" },
    { code: "BT", name: "Butan", flag: "🇧🇹" },
    { code: "BO", name: "Bolivya", flag: "🇧🇴" },
    { code: "BA", name: "Bosna Hersek", flag: "🇧🇦" },
    { code: "BW", name: "Botsvana", flag: "🇧🇼" },
    { code: "BR", name: "Brezilya", flag: "🇧🇷" },
    { code: "BN", name: "Brunei", flag: "🇧🇳" },
    { code: "BG", name: "Bulgaristan", flag: "🇧🇬" },
    { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
    { code: "BI", name: "Burundi", flag: "🇧🇮" },
    { code: "KH", name: "Kamboçya", flag: "🇰🇭" },
    { code: "CM", name: "Kamerun", flag: "🇨🇲" },
    { code: "CA", name: "Kanada", flag: "🇨🇦" },
    { code: "CV", name: "Yeşil Burun Adaları", flag: "🇨🇻" },
    { code: "CF", name: "Orta Afrika Cumhuriyeti", flag: "🇨🇫" },
    { code: "TD", name: "Çad", flag: "🇹🇩" },
    { code: "CL", name: "Şili", flag: "🇨🇱" },
    { code: "CN", name: "Çin", flag: "🇨🇳" },
    { code: "CO", name: "Kolombiya", flag: "🇨🇴" },
    { code: "KM", name: "Komorlar", flag: "🇰🇲" },
    { code: "CG", name: "Kongo Cumhuriyeti", flag: "🇨🇬" },
    { code: "CD", name: "Demokratik Kongo Cumhuriyeti", flag: "🇨🇩" },
    { code: "CR", name: "Kosta Rika", flag: "🇨🇷" },
    { code: "HR", name: "Hırvatistan", flag: "🇭🇷" },
    { code: "CU", name: "Küba", flag: "🇨🇺" },
    { code: "CY", name: "Kıbrıs", flag: "🇨🇾" },
    { code: "CZ", name: "Çek Cumhuriyeti", flag: "🇨🇿" },
    { code: "DK", name: "Danimarka", flag: "🇩🇰" },
    { code: "DJ", name: "Cibuti", flag: "🇩🇯" },
    { code: "DM", name: "Dominika", flag: "🇩🇲" },
    { code: "DO", name: "Dominik Cumhuriyeti", flag: "🇩🇴" },
    { code: "EC", name: "Ekvador", flag: "🇪🇨" },
    { code: "EG", name: "Mısır", flag: "🇪🇬" },
    { code: "SV", name: "El Salvador", flag: "🇸🇻" },
    { code: "GQ", name: "Ekvator Ginesi", flag: "🇬🇶" },
    { code: "ER", name: "Eritre", flag: "🇪🇷" },
    { code: "EE", name: "Estonya", flag: "🇪🇪" },
    { code: "ET", name: "Etiyopya", flag: "🇪🇹" },
    { code: "FJ", name: "Fiji", flag: "🇫🇯" },
    { code: "FI", name: "Finlandiya", flag: "🇫🇮" },
    { code: "FR", name: "Fransa", flag: "🇫🇷" },
    { code: "GA", name: "Gabon", flag: "🇬🇦" },
    { code: "GM", name: "Gambiya", flag: "🇬🇲" },
    { code: "GE", name: "Gürcistan", flag: "🇬🇪" },
    { code: "DE", name: "Almanya", flag: "🇩🇪" },
    { code: "GH", name: "Gana", flag: "🇬🇭" },
    { code: "GR", name: "Yunanistan", flag: "🇬🇷" },
    { code: "GD", name: "Grenada", flag: "🇬🇩" },
    { code: "GT", name: "Guatemala", flag: "🇬🇹" },
    { code: "GN", name: "Gine", flag: "🇬🇳" },
    { code: "GW", name: "Gine-Bissau", flag: "🇬🇼" },
    { code: "GY", name: "Guyana", flag: "🇬🇾" },
    { code: "HT", name: "Haiti", flag: "🇭🇹" },
    { code: "HN", name: "Honduras", flag: "🇭🇳" },
    { code: "HU", name: "Macaristan", flag: "🇭🇺" },
    { code: "IS", name: "İzlanda", flag: "🇮🇸" },
    { code: "IN", name: "Hindistan", flag: "🇮🇳" },
    { code: "ID", name: "Endonezya", flag: "🇮🇩" },
    { code: "IR", name: "İran", flag: "🇮🇷" },
    { code: "IQ", name: "Irak", flag: "🇮🇶" },
    { code: "IE", name: "İrlanda", flag: "🇮🇪" },
    { code: "IL", name: "İsrail", flag: "🇮🇱" },
    { code: "IT", name: "İtalya", flag: "🇮🇹" },
    { code: "JM", name: "Jamaika", flag: "🇯🇲" },
    { code: "JP", name: "Japonya", flag: "🇯🇵" },
    { code: "JO", name: "Ürdün", flag: "🇯🇴" },
    { code: "KZ", name: "Kazakistan", flag: "🇰🇿" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "KI", name: "Kiribati", flag: "🇰🇮" },
    { code: "KP", name: "Kuzey Kore", flag: "🇰🇵" },
    { code: "KR", name: "Güney Kore", flag: "🇰🇷" },
    { code: "KW", name: "Kuveyt", flag: "🇰🇼" },
    { code: "KG", name: "Kırgızistan", flag: "🇰🇬" },
    { code: "LA", name: "Laos", flag: "🇱🇦" },
    { code: "LV", name: "Letonya", flag: "🇱🇻" },
    { code: "LB", name: "Lübnan", flag: "🇱🇧" },
    { code: "LS", name: "Lesotho", flag: "🇱🇸" },
    { code: "LR", name: "Liberya", flag: "🇱🇷" },
    { code: "LY", name: "Libya", flag: "🇱🇾" },
    { code: "LI", name: "Lihtenştayn", flag: "🇱🇮" },
    { code: "LT", name: "Litvanya", flag: "🇱🇹" },
    { code: "LU", name: "Lüksemburg", flag: "🇱🇺" },
    { code: "MK", name: "Makedonya", flag: "🇲🇰" },
    { code: "MG", name: "Madagaskar", flag: "🇲🇬" },
    { code: "MW", name: "Malavi", flag: "🇲🇼" },
    { code: "MY", name: "Malezya", flag: "🇲🇾" },
    { code: "MV", name: "Maldivler", flag: "🇲🇻" },
    { code: "ML", name: "Mali", flag: "🇲🇱" },
    { code: "MT", name: "Malta", flag: "🇲🇹" },
    { code: "MH", name: "Marshall Adaları", flag: "🇲🇭" },
    { code: "MR", name: "Moritanya", flag: "🇲🇷" },
    { code: "MU", name: "Mauritius", flag: "🇲🇺" },
    { code: "MX", name: "Meksika", flag: "🇲🇽" },
    { code: "FM", name: "Mikronezya", flag: "🇫🇲" },
    { code: "MD", name: "Moldova", flag: "🇲🇩" },
    { code: "MC", name: "Monako", flag: "🇲🇨" },
    { code: "MN", name: "Moğolistan", flag: "🇲🇳" },
    { code: "ME", name: "Karadağ", flag: "🇲🇪" },
    { code: "MA", name: "Fas", flag: "🇲🇦" },
    { code: "MZ", name: "Mozambik", flag: "🇲🇿" },
    { code: "MM", name: "Myanmar", flag: "🇲🇲" },
    { code: "NA", name: "Namibya", flag: "🇳🇦" },
    { code: "NR", name: "Nauru", flag: "🇳🇷" },
    { code: "NP", name: "Nepal", flag: "🇳🇵" },
    { code: "NL", name: "Hollanda", flag: "🇳🇱" },
    { code: "NZ", name: "Yeni Zelanda", flag: "🇳🇿" },
    { code: "NI", name: "Nikaragua", flag: "🇳🇮" },
    { code: "NE", name: "Nijer", flag: "🇳🇪" },
    { code: "NG", name: "Nijerya", flag: "🇳🇬" },
    { code: "NO", name: "Norveç", flag: "🇳🇴" },
    { code: "OM", name: "Umman", flag: "🇴🇲" },
    { code: "PK", name: "Pakistan", flag: "🇵🇰" },
    { code: "PW", name: "Palau", flag: "🇵🇼" },
    { code: "PA", name: "Panama", flag: "🇵🇦" },
    { code: "PG", name: "Papua Yeni Gine", flag: "🇵🇬" },
    { code: "PY", name: "Paraguay", flag: "🇵🇾" },
    { code: "PE", name: "Peru", flag: "🇵🇪" },
    { code: "PH", name: "Filipinler", flag: "🇵🇭" },
    { code: "PL", name: "Polonya", flag: "🇵🇱" },
    { code: "PT", name: "Portekiz", flag: "🇵🇹" },
    { code: "QA", name: "Katar" },
    { code: "RO", name: "Romanya", flag: "🇷🇴" },
    { code: "RU", name: "Rusya", flag: "🇷🇺" },
    { code: "RW", name: "Ruanda", flag: "🇷🇼" },
    { code: "KN", name: "Saint Kitts ve Nevis", flag: "🇰🇳" },
    { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
    { code: "VC", name: "Saint Vincent ve Grenadinler", flag: "🇻🇨" },
    { code: "WS", name: "Samoa", flag: "🇼🇸" },
    { code: "SM", name: "San Marino", flag: "🇸🇲" },
    { code: "ST", name: "Sao Tome ve Principe", flag: "🇸🇹" },
    { code: "SA", name: "Suudi Arabistan", flag: "🇸🇦" },
    { code: "SN", name: "Senegal", flag: "🇸🇳" },
    { code: "RS", name: "Sırbistan", flag: "🇷🇸" },
    { code: "SC", name: "Seyşeller", flag: "🇸🇨" },
    { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
    { code: "SG", name: "Singapur", flag: "🇸🇬" },
    { code: "SK", name: "Slovakya", flag: "🇸🇰" },
    { code: "SI", name: "Slovenya", flag: "🇸🇮" },
    { code: "SB", name: "Solomon Adaları", flag: "🇸🇧" },
    { code: "SO", name: "Somali", flag: "🇸🇴" },
    { code: "ZA", name: "Güney Afrika", flag: "🇿🇦" },
    { code: "ES", name: "İspanya", flag: "🇪🇸" },
    { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "SD", name: "Sudan", flag: "🇸🇩" },
    { code: "SR", name: "Surinam", flag: "🇸🇷" },
    { code: "SZ", name: "Svaziland", flag: "🇸🇿" },
    { code: "SE", name: "İsveç", flag: "🇸🇪" },
    { code: "CH", name: "İsviçre", flag: "🇨🇭" },
    { code: "SY", name: "Suriye", flag: "🇸🇾" },
    { code: "TW", name: "Tayvan", flag: "🇹🇼" },
    { code: "TJ", name: "Tacikistan", flag: "🇹🇯" },
    { code: "TZ", name: "Tanzanya", flag: "🇹🇿" },
    { code: "TH", name: "Tayland", flag: "🇹🇭" },
    { code: "TG", name: "Togo", flag: "🇹🇬" },
    { code: "TO", name: "Tonga", flag: "🇹🇴" },
    { code: "TT", name: "Trinidad ve Tobago", flag: "🇹🇹" },
    { code: "TN", name: "Tunus", flag: "🇹🇳" },
    { code: "TR", name: "Türkiye", flag: "🇹🇷" },
    { code: "TM", name: "Türkmenistan", flag: "🇹🇲" },
    { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
    { code: "UG", name: "Uganda", flag: "🇺🇬" },
    { code: "UA", name: "Ukrayna", flag: "🇺🇦" },
    { code: "AE", name: "Birleşik Arap Emirlikleri", flag: "🇦🇪" },
    { code: "GB", name: "Birleşik Krallık", flag: "🇬🇧" },
    { code: "US", name: "Amerika Birleşik Devletleri", flag: "🇺🇸" },
    { code: "UY", name: "Uruguay", flag: "🇺🇾" },
    { code: "UZ", name: "Özbekistan", flag: "🇺🇿" },
    { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
    { code: "VE", name: "Venezuela", flag: "🇻🇪" },
    { code: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "YE", name: "Yemen", flag: "🇾🇪" },
    { code: "ZM", name: "Zambiya", flag: "🇿🇲" },
    { code: "ZW", name: "Zimbabve", flag: "🇿🇼" }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCountrySelect();

    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            navBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Resize map if switching to countries view
            if (targetId === 'countries-view') {
                if (!mapInstance) {
                    initMap();
                } else {
                    setTimeout(() => mapInstance.updateSize(), 100);
                }
            }
        });
    });

    if (isConfigured()) {
        fetchData();
    } else {
        showError('Lütfen app.js dosyasındaki GitHub yapılandırmasını (token, username, repo) düzenleyin.');
    }
});

function populateCountrySelect() {
    countrySelect.innerHTML = '<option value="">Bir ülke seçiniz...</option>';

    const sortedCountries = [...countryList].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        // Use flag emoji + name for dropdown (Simplest compatible way)
        option.textContent = `${country.flag} ${country.name}`;
        countrySelect.appendChild(option);
    });
}

function isConfigured() {
    return config.token !== 'YOUR_GITHUB_TOKEN_HERE' &&
        config.username !== 'YOUR_USERNAME_HERE' &&
        config.repo !== 'YOUR_REPO_NAME_HERE';
}

function initMap() {
    const mapEl = document.getElementById('world-map');
    if (!mapEl) return;

    // Check availability
    if (typeof jsVectorMap === 'undefined') {
        // Should have loaded by now if script tags are in body
        console.warn('jsVectorMap lib not loaded immediately');

        // One-time retry after short delay (safe)
        setTimeout(() => {
            if (typeof jsVectorMap !== 'undefined') {
                initMapInstance(mapEl);
            } else {
                mapEl.innerHTML = '<p style="text-align:center;padding:1rem;color:#777;">Harita şu an yüklenemedi. Lütfen internetinizi kontrol edip yenileyin.</p>';
            }
        }, 1000);
        return;
    }

    initMapInstance(mapEl);
}

function initMapInstance(mapEl) {
    // Collect selected regions
    const selected = getSelectedRegions();

    // Clean up existing instance properly
    if (mapInstance && typeof mapInstance.destroy === 'function') {
        try {
            mapInstance.destroy();
        } catch (e) { console.warn('Map destroy failed', e); }
    }

    mapEl.innerHTML = '';
    mapInstance = null;

    try {
        mapInstance = new jsVectorMap({
            selector: '#world-map',
            map: 'world',
            backgroundColor: 'transparent',
            zoomButtons: true,
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    fill: '#e2e8f0',
                    "fill-opacity": 1,
                    stroke: '#cbd5e1',
                    "stroke-width": 0.5,
                    "stroke-opacity": 1
                },
                hover: {
                    "fill-opacity": 0.8,
                    cursor: 'pointer'
                },
                selected: {
                    fill: '#475569'
                }
            },
            selectedRegions: selected
        });
        console.log('Map initialized');
    } catch (e) {
        console.error('Map init error:', e);
        mapEl.innerHTML = '<p style="text-align:center;padding:1rem;">Harita hatası: ' + e.message + '</p>';
    }
}

function getSelectedRegions() {
    if (!appData.countries) return [];
    return appData.countries.map(c => c.code).filter(c => c);
}

// Data Operations
async function fetchData() {
    showLoading(true);
    errorMessage.classList.add('hidden');

    try {
        const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${config.path}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 404) {
            appData = { places: [], countries: [] };
            renderAll();
            return;
        }

        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

        const data = await response.json();
        const content = decodeURIComponent(escape(atob(data.content)));
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
            appData = { places: parsed, countries: [] };
        } else {
            appData = parsed;
        }

        if (!appData.places) appData.places = [];
        if (!appData.countries) appData.countries = [];

        renderAll();

    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Veriler yüklenirken bir sorun oluştu.<br>' + error.message);
    } finally {
        showLoading(false);
    }
}

async function saveData(newData) {
    showLoading(true);

    try {
        const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${config.path}`;

        let sha = null;
        try {
            const getResponse = await fetch(url, {
                headers: { 'Authorization': `token ${config.token}` }
            });
            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }
        } catch (e) { }

        const contentStr = JSON.stringify(newData, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(contentStr)));

        const body = {
            message: `Update data`,
            content: contentBase64
        };
        if (sha) body.sha = sha;

        const putResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${config.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!putResponse.ok) throw new Error('Kayıt başarısız.');

        appData = newData;
        renderAll();

        // Re-initialize map to ensure data consistency
        if (typeof jsVectorMap !== 'undefined') {
            initMap();
        }

    } catch (error) {
        console.error('Error saving:', error);
        showError('Kaydedilemedi: ' + error.message);
    } finally {
        showLoading(false);
        resetButton(addPlaceForm.querySelector('button'), 'Listeye Ekle', 'arrow-right');
        resetButton(addCountryForm.querySelector('button'), 'Ülkeyi Ekle', 'earth-americas');
    }
}

function resetButton(btn, text, icon) {
    btn.disabled = false;
    btn.innerHTML = `<span>${text}</span><i class="fa-solid fa-${icon}"></i>`;
}

// Add Forms
addPlaceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setLoadingButton(addPlaceForm.querySelector('button'));

    const newPlace = {
        name: document.getElementById('place-name').value,
        location: document.getElementById('place-location').value,
        description: document.getElementById('place-description').value,
        dateAdded: new Date().toISOString()
    };

    const newData = JSON.parse(JSON.stringify(appData));
    newData.places.push(newPlace);

    saveData(newData).then(() => {
        addPlaceForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

addCountryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setLoadingButton(addCountryForm.querySelector('button'));

    const select = document.getElementById('country-select');
    const selectedOption = select.options[select.selectedIndex];

    if (!select.value) {
        alert("Lütfen bir ülke seçiniz.");
        resetButton(addCountryForm.querySelector('button'), 'Ülkeyi Ekle', 'earth-americas');
        return;
    }

    const newCountry = {
        code: select.value,
        // Strip emoji from name for cleaner data? Or keep it?
        // Let's keep clean name from data list to be safe
        name: countryList.find(c => c.code === select.value).name,
        priority: parseInt(document.getElementById('country-priority').value),
        dateAdded: new Date().toISOString()
    };

    const newData = JSON.parse(JSON.stringify(appData));

    const existingIndex = newData.countries.findIndex(c => c.code === newCountry.code);

    if (existingIndex > -1) {
        // Update existing
        newData.countries[existingIndex] = newCountry;
    } else {
        // Add new
        newData.countries.push(newCountry);
    }

    saveData(newData).then(() => {
        addCountryForm.reset();
        countriesContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

function setLoadingButton(btn) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;margin:0;border-width:2px;border-top-color:white;"></div> Kaydediliyor...';
}

// Rendering
function renderAll() {
    renderPlaces();
    renderCountries();
}

function renderPlaces() {
    placesContainer.innerHTML = '';
    placeCountBadge.textContent = `${appData.places.length} Rota`;

    if (appData.places.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        const sorted = [...appData.places].reverse();
        sorted.forEach(place => {
            const el = createPlaceCard(place);
            placesContainer.appendChild(el);
        });
    }
}

function renderCountries() {
    countriesContainer.innerHTML = '';
    countryCountBadge.textContent = `${appData.countries.length} Ülke`;

    // Sort by Priority
    const sorted = [...appData.countries].sort((a, b) => a.priority - b.priority);

    sorted.forEach(country => {
        const el = createCountryCard(country);
        countriesContainer.appendChild(el);
    });
}

function createPlaceCard(place) {
    const date = new Date(place.dateAdded).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const div = document.createElement('div');
    div.className = 'place-card';
    div.innerHTML = `
        <div class="place-header">
            <h3 class="place-name">${escapeHtml(place.name)}</h3>
            <span class="place-date">${date}</span>
        </div>
        <div class="place-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${escapeHtml(place.location)}</span>
        </div>
        <p class="place-description">${escapeHtml(place.description)}</p>
    `;
    return div;
}

function createCountryCard(country) {
    const priorities = {
        1: 'Kesin gidelim',
        2: 'Daha sonra gidelim',
        3: 'Gidelim',
        4: 'Bi ara gideriz',
        5: 'Belki gideriz'
    };

    // Use flag-icons CSS
    const flagClass = `fi fi-${country.code.toLowerCase()}`;

    const div = document.createElement('div');
    div.className = 'place-card';
    div.innerHTML = `
        <div class="place-header">
            <h3 class="place-name">
                <span class="${flagClass}" style="margin-right:8px; border-radius:3px;"></span>
                ${escapeHtml(country.name)}
            </h3>
            <span class="priority-badge p-${country.priority}">${priorities[country.priority]}</span>
        </div>
    `;
    return div;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function showLoading(show) {
    if (show) loadingIndicator.classList.remove('hidden');
    else loadingIndicator.classList.add('hidden');
}

function showError(msg) {
    errorMessage.innerHTML = msg;
    errorMessage.classList.remove('hidden');
}
