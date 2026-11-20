(function () {
  var configel = document.getElementById("lang-config");
  if (!configel) {
    return;
  }

  var config;
  try {
    config = JSON.parse(configel.textContent);
  } catch (e) {
    return;
  }

  var STORAGE_KEY = "lang";
  var SESSION_KEY = "lang-detected";
  var languages = config.languages || [];
  var homes = config.homes || {};
  var translations = config.translations || {};
  var current = config.current || "";

  function getStore(kind) {
    try {
      return kind === "local" ? window.localStorage : window.sessionStorage;
    } catch (e) {
      return null;
    }
  }

  function readStorage(key, kind) {
    var store = getStore(kind);
    if (!store) {
      return "";
    }
    try {
      return store.getItem(key) || "";
    } catch (e) {
      return "";
    }
  }

  function writeStorage(key, value, kind) {
    var store = getStore(kind);
    if (!store) {
      return;
    }
    try {
      store.setItem(key, value);
    } catch (e) {
      /* ignore quota / privacy mode errors */
    }
  }

  function readCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"),
    );
    return match ? decodeURIComponent(match[1]) : "";
  }

  function writeCookie(value) {
    try {
      if (value) {
        document.cookie = "lang=" + encodeURIComponent(value) +
          "; Path=/; Max-Age=31536000; SameSite=Lax";
      } else {
        document.cookie = "lang=; Path=/; Max-Age=0; SameSite=Lax";
      }
    } catch (e) {
      /* ignore */
    }
  }

  function normalize(code) {
    var value = String(code || "").toLowerCase().replace(/_/g, "-");
    return value.split("-")[0];
  }

  function matchLang(code) {
    var value = String(code || "").toLowerCase().replace(/_/g, "-");
    if (!value) {
      return "";
    }

    var primary = normalize(value);
    var primaryMatch = "";

    for (var i = 0; i < languages.length; i++) {
      var item = languages[i];
      var langCode = String(item.lang || "").toLowerCase();
      var localeCode = String(item.locale || "").toLowerCase().replace(
        /_/g,
        "-",
      );

      if (langCode === value || localeCode === value) {
        return item.lang;
      }
      if (
        !primaryMatch &&
        (normalize(langCode) === primary || normalize(localeCode) === primary)
      ) {
        primaryMatch = item.lang;
      }
    }

    return primaryMatch;
  }

  function detectFromBrowser() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

    for (var i = 0; i < list.length; i++) {
      var match = matchLang(list[i]);
      if (match) {
        return match;
      }
    }
    return "";
  }

  function isLanguageHome() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    for (var lang in homes) {
      if (!Object.prototype.hasOwnProperty.call(homes, lang)) {
        continue;
      }
      var home = String(homes[lang]).replace(/\/+$/, "") || "/";
      if (home === path) {
        return true;
      }
    }
    return false;
  }

  function redirect(lang) {
    var url = translations[lang] || homes[lang];
    if (!url) {
      return false;
    }

    writeStorage(SESSION_KEY, "1", "session");
    if (url === window.location.pathname) {
      return false;
    }
    window.location.replace(url);
    return true;
  }

  /* Remember explicit choices made through the language switcher. */
  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest
      ? target.closest("[data-set-lang]")
      : null;
    if (!link) {
      return;
    }

    var lang = link.getAttribute("data-set-lang");
    if (!lang) {
      return;
    }

    if (config.remember) {
      writeStorage(STORAGE_KEY, lang, "local");
      writeCookie(lang);
    } else {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* ignore */
      }
      writeCookie("");
    }
    writeStorage(SESSION_KEY, "1", "session");
  });

  if (!config.detect) { // don't need to auto detect the language.
    return;
  }

  /* Explicit override: ?lang=xx */
  var lang = "";
  try {
    lang = new URLSearchParams(window.location.search).get("lang") || "";
  } catch (e) {
    /* ignore */
  }
  if (lang) {
    var target = matchLang(lang);
    if (target && target !== current) {
      redirect(target);
    }
    return;
  }

  /* Stored preference (manual choice or edge-detected cookie). */
  var stored = readStorage(STORAGE_KEY, "local") || readCookie("lang");
  if (stored) {
    var storedTarget = matchLang(stored);
    if (storedTarget) {
      if (storedTarget !== current && isLanguageHome()) {
        redirect(storedTarget);
      }
      return;
    }
  }

  /* Only auto-detect once per browser session. */
  if (readStorage(SESSION_KEY, "session")) {
    return;
  }

  var detected = detectFromBrowser();
  if (!detected || detected === current) {
    writeStorage(SESSION_KEY, "1", "session");
    return;
  }

  redirect(detected);
})();
