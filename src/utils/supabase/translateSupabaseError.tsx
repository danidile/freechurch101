export const translateSupabaseError = (errorMessage: string) => {
  const translations: Record<string, string> = {
    "Invalid login credentials": "Credenziali di accesso non valide",
    "User already registered": "Utente già registrato",
    "User not found": "Utente non trovato",
    "Invalid password": "Password non valida",
    "Email already in use": "Email già in uso",
    "Token has expired": "Il token è scaduto",
    "An error occurred": "Si è verificato un errore",
    "Network request failed": "Richiesta di rete fallita",
    "Email is required": "L'email è obbligatoria",
    "Password is required": "La password è obbligatoria",
    "Email is invalid": "L'email non è valida",
    "Password must be at least 8 characters":
      "La password deve contenere almeno 8 caratteri",
    "User is not confirmed": "L'utente non è confermato",
    "User is blocked": "L'utente è bloccato",
    "User must verify email before logging in":
      "L'utente deve verificare l'email prima di accedere",
    "Session expired. Please log in again":
      "Sessione scaduta. Effettua nuovamente l'accesso",
    "Invalid or expired token": "Token non valido o scaduto",
    "User is already signed in": "L'utente è già connesso",
    "Invalid OTP code": "Codice OTP non valido",
    "No user found for this email": "Nessun utente trovato per questa email",
    "Invalid authentication method": "Metodo di autenticazione non valido",
    "Provider not supported": "Provider non supportato",
    "User does not have permission to perform this action":
      "L'utente non ha il permesso per eseguire questa azione",
    "User session not found": "Sessione utente non trovata",
    "Failed to refresh session": "Aggiornamento della sessione fallito",
    "Invalid refresh token": "Token di aggiornamento non valido",
    "Sign-in attempt limit exceeded. Try again later":
      "Limite di tentativi di accesso superato. Riprova più tardi",
    "User is disabled": "L'utente è disabilitato",
    "Email not confirmed": "Email non confermata",
    "Phone number is invalid": "Numero di telefono non valido",
    "Phone number already in use": "Numero di telefono già in uso",
    "User already exists": "L'utente esiste già",
    "Could not retrieve user information":
      "Impossibile recuperare le informazioni dell'utente",
    "Error sending verification email":
      "Errore nell'invio dell'email di verifica",
    "Error sending password reset email":
      "Errore nell'invio dell'email di reimpostazione della password",
    "Service unavailable. Try again later":
      "Servizio non disponibile. Riprova più tardi",
    "Database error": "Errore del database",
    "Storage bucket not found": "Bucket di archiviazione non trovato",
    "Storage upload failed": "Caricamento nello storage fallito",
    "Storage file not found": "File nello storage non trovato",
    "Access denied": "Accesso negato",
    "Resource limit exceeded": "Limite di risorse superato",
    "Function execution timeout": "Timeout nell'esecuzione della funzione",
    "Invalid function request": "Richiesta della funzione non valida",
    "Realtime connection failed": "Connessione in tempo reale fallita",
    "Realtime subscription error": "Errore nella sottoscrizione in tempo reale",
    "Invalid request parameters": "Parametri della richiesta non validi",
    "Not found": "Non trovato",
    "Internal server error": "Errore interno del server",
    "Bad request": "Richiesta non valida",
    Unauthorized: "Non autorizzato",
    Forbidden: "Vietato",
    "Too many requests": "Troppe richieste",
  };

  return translations[errorMessage] || "Errore sconosciuto";
};
