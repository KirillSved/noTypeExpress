// Права доступа
const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email', // доступ до адреси електронної пошти
    'https://www.googleapis.com/auth/userinfo.profile' // доступ до інформації профілю
];

// Посилання на аутентифікацію
const GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/auth';

// Посилання на отримання токена
const GOOGLE_TOKEN_URI = 'https://accounts.google.com/o/oauth2/token';

// Посилання на отримання інформації про користувача
const GOOGLE_USER_INFO_URI = 'https://www.googleapis.com/oauth2/v1/userinfo';

// Client ID з кроку #3
const GOOGLE_CLIENT_ID = '878084819884-u11tuuhc5be2an6eeh13vfa28psq8pk6.apps.googleusercontent.com';

// Client Secret з кроку #3
const GOOGLE_CLIENT_SECRET = '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';

// Посилання з секції "Authorized redirect URIs" з кроку #3


const parameters = {
    redirect_uri  = GOOGLE_REDIRECT_URI,
    response_type = code,
    client_id     = GOOGLE_CLIENT_ID,
    scope         = GOOGLE_SCOPES,
};
//Собираем URI, используя константу с фрагментом адреса и массив параметров:

$uri = GOOGLE_AUTH_URI . '?' . http_build_query($parameters);