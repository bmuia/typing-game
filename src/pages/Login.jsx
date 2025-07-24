import React from 'react';

function Login() {
  const handleGoogle = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:8000/accounts/google/login/';
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl border border-green-500 p-6 rounded-md shadow-lg bg-black/80">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            ➤ typer-racer-terminal v0.1.0
          </h1>
          <p>Welcome, challenger. Are your fingers fast enough?</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-green-300">
            # Only Google login supported. Auth is optional, but WPM glory is eternal.
          </p>
        </div>

        <div className="my-6 flex justify-center">
          <button
            onClick={handleGoogle}
            className="flex items-center gap-3 bg-green-400 text-black py-2 px-4 rounded font-bold hover:bg-green-300 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>Login with Google</span>
          </button>
        </div>

        <div className="mt-6 text-xs text-green-500 italic">
          > game.dev.status: [ 🧪 experimental ]  
        </div>
      </div>

      <div className="mt-10 text-xs text-green-700">
        <pre className="whitespace-pre">
{`> initializing...
> connecting to Google servers...
> standing by for your login...
`}
        </pre>
      </div>
    </div>
  );
}

export default Login;
