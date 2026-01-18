/**
 * Safe Exam Browser (SEB) Configuration Generator
 * Generates .seb configuration files for secure assessment access
 */

const crypto = require('crypto');

/**
 * Generate a SEB configuration file content
 * @param {Object} options - Configuration options
 * @returns {Object} - SEB config object
 */
exports.generateSEBConfig = (options = {}) => {
    const {
        assessmentUrl,
        assessmentTitle = 'Alanxa Assessment',
        timeLimit = 60, // minutes
        allowQuit = false,
        allowReload = false,
        allowSpellCheck = false,
        enableCamera = true,
        browserWindowMode = 1, // 1 = fullscreen
        showTaskBar = false,
        showClock = true,
        allowVirtualMachine = false,
        allowScreenCapture = false
    } = options;

    const sebConfig = {
        // Start URL - the assessment page
        startURL: assessmentUrl,
        startURLAllowDeepLink: false,

        // Security settings
        allowQuit: allowQuit,
        ignoreExitKeys: true,
        hashedQuitPassword: '', // Empty means no quit allowed

        // Browser settings
        browserWindowMode: browserWindowMode, // 1 = fullscreen
        mainBrowserWindowWidth: '100%',
        mainBrowserWindowHeight: '100%',
        mainBrowserWindowPositioningMode: 0,
        enableBrowserWindowToolbar: false,
        hideBrowserWindowToolbar: true,
        showMenuBar: false,
        showTaskBar: showTaskBar,
        showReloadButton: allowReload,
        showTime: showClock,
        showInputLanguage: false,
        enableZoomPage: false,
        enableZoomText: false,
        allowSpellCheck: allowSpellCheck,
        allowDictionaryLookup: false,

        // Navigation restrictions
        allowBrowsingBackForward: false,
        newBrowserWindowByLinkPolicy: 0, // 0 = get generally blocked
        newBrowserWindowByScriptPolicy: 0, // 0 = opening not allowed
        newBrowserWindowByLinkBlockForeign: true,
        newBrowserWindowNavigation: false,
        removeBrowserProfile: true,
        removeLocalStorage: true,

        // Security features
        allowVirtualMachine: allowVirtualMachine,
        allowScreenSharing: false,
        allowScreenCapture: allowScreenCapture,
        enablePrivateClipboard: true,
        allowUserSwitching: false,
        forceAppFolderInstall: false,
        allowSiri: false,
        allowDictation: false,
        detectStoppedProcess: true,
        allowDisplayMirroring: false,
        allowedDisplaysMaxNumber: 1,
        allowedDisplayBuiltinEnforce: true,

        // Kiosk mode
        createNewDesktop: true,
        killExplorerShell: false, // Set to true for maximum lockdown
        monitorProcesses: true,

        // URL filter
        URLFilterEnable: true,
        URLFilterEnableContentFilter: false,
        URLFilterRules: [
            {
                action: 1, // 1 = allow
                active: true,
                expression: assessmentUrl.replace(/^https?:\/\//, '').split('/')[0] + '/*',
                regex: false
            },
            {
                action: 0, // 0 = block
                active: true,
                expression: '*',
                regex: false
            }
        ],

        // Exam key for verification (can be used to verify SEB is running)
        examSessionClearCookiesOnEnd: true,
        examSessionClearCookiesOnStart: true,

        // Additional settings
        enableAppSwitcherCheck: true,
        forceAppFolderInstall: false,
        allowPreferencesWindow: false,
        downloadDirectoryOSX: '~/Downloads',
        downloadDirectoryWin: '',
        openDownloads: false,
        chooseFileToUploadPolicy: 0,
        downloadPDFFiles: false,
        allowPDFPlugIn: false,
        downloadAndOpenSebConfig: true,

        // Logging
        enableLogging: true,
        logDirectoryOSX: '~/Library/Logs/SEB',
        logDirectoryWin: '',
        logLevel: 1,

        // Title
        browserExamKey: crypto.randomBytes(32).toString('hex'),
        configFileVersion: 3,
        sebConfigPurpose: 0, // 0 = starting an exam

        // Accessibility
        enableTouchExit: false
    };

    return sebConfig;
};

/**
 * Generate a downloadable SEB config file
 * @param {Object} config - SEB configuration object
 * @returns {Buffer} - Buffer containing the .seb file content
 */
exports.generateSEBFile = (config) => {
    // SEB files are XML plist format, but for simplicity we'll use JSON
    // The actual SEB software can read both formats
    const plistContent = generatePlist(config);
    return Buffer.from(plistContent, 'utf-8');
};

/**
 * Generate XML plist format for SEB config
 */
function generatePlist(config) {
    let plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
`;

    for (const [key, value] of Object.entries(config)) {
        plist += `    <key>${key}</key>\n`;
        plist += `    ${formatPlistValue(value)}\n`;
    }

    plist += `</dict>
</plist>`;

    return plist;
}

function formatPlistValue(value) {
    if (typeof value === 'boolean') {
        return value ? '<true/>' : '<false/>';
    } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return `<integer>${value}</integer>`;
        } else {
            return `<real>${value}</real>`;
        }
    } else if (typeof value === 'string') {
        return `<string>${escapeXml(value)}</string>`;
    } else if (Array.isArray(value)) {
        let arr = '<array>\n';
        for (const item of value) {
            if (typeof item === 'object') {
                arr += '        <dict>\n';
                for (const [k, v] of Object.entries(item)) {
                    arr += `            <key>${k}</key>\n`;
                    arr += `            ${formatPlistValue(v)}\n`;
                }
                arr += '        </dict>\n';
            } else {
                arr += `        ${formatPlistValue(item)}\n`;
            }
        }
        arr += '    </array>';
        return arr;
    } else if (typeof value === 'object' && value !== null) {
        let dict = '<dict>\n';
        for (const [k, v] of Object.entries(value)) {
            dict += `        <key>${k}</key>\n`;
            dict += `        ${formatPlistValue(v)}\n`;
        }
        dict += '    </dict>';
        return dict;
    }
    return `<string>${value}</string>`;
}

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Verify if request is coming from SEB browser
 * @param {Object} req - Express request object
 * @returns {boolean}
 */
exports.isSEBBrowser = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const sebHeader = req.headers['x-safeexambrowser-requesthash'];

    // SEB includes specific identifiers in User-Agent
    const isSEB = userAgent.includes('SEB/') ||
        userAgent.includes('SafeExamBrowser') ||
        !!sebHeader;

    return isSEB;
};

/**
 * Generate SEB launch link (seb:// protocol)
 * @param {string} configUrl - URL to the .seb config file
 * @returns {string}
 */
exports.getSEBLaunchLink = (configUrl) => {
    // Convert http/https URL to seb/sebs protocol
    return configUrl.replace(/^https:\/\//, 'sebs://').replace(/^http:\/\//, 'seb://');
};
