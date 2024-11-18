export const get_login = async (username, password) => {
    //const navigate = useNavigate(); // Add `async` to the function declaration
    try {
        const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
        username, 
        password,
        }),
        });
    
        if (!response.ok) {
            alert("Credenciales inválidas");
            return null;
        }
    
        const data = await response.json();
        return data.access_token;
        //localStorage.setItem("access_token", data.access_token);
    
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error. Inténtalo de nuevo más tarde.");
    }
    };
    
export const signup = async (username, email, password) => {
    try {
        const response = await fetch("http://localhost:8000/users/", { 
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        return response;
    
    } catch (error) {
        console.error("Error connecting to the backend:", error);
        alert(`There was a problem connecting to the server: ${error.message}`);
    }
};