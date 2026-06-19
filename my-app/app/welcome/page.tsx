export default function WelcomePage() { 

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Goober!</h1>
                <p className="text-gray-600 mb-6">Your account has been successfully created.</p>
                <a href="/login" className="text-blue-500 hover:underline">Click here to log in</a>
            </div>
        </div>
    );
}