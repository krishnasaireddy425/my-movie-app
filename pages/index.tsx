import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, FormEvent } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [favorite, setFavorite] = useState<string | null>(null);
  const [movieInput, setMovieInput] = useState("");
  const [fact, setFact] = useState("");
  const [showMovieForm, setShowMovieForm] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/favorite")
        .then(res => res.json())
        .then(data => {
          setFavorite(data.favorite);
          if (!data.favorite) {
            setShowMovieForm(true);
          }
        });
    }
  }, [status]);

  useEffect(() => {
    if (favorite) {
      fetch("/api/funfact")
        .then(res => res.json())
        .then(data => setFact(data.fact));
    }
  }, [favorite]);

  useEffect(() => {
    if (favorite) {
      refreshFact();
    }
  }, []);

  const refreshFact = () => {
    if (favorite) {
      setFact("Loading a fresh fact…");
      fetch("/api/funfact")
        .then(res => res.json())
        .then(data => setFact(data.fact));
    }
  };

  if (status === "loading") return <p>Loading…</p>;
  
  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Movie Fun Facts</h1>
        <h3 style={{ fontWeight: "normal" }}>Sign in to get started</h3>
        <button 
          onClick={() => signIn("google")}
          style={{ 
            padding: "10px 20px", 
            fontSize: "16px", 
            backgroundColor: "#4285f4", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer" 
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const handleSaveMovie = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie: movieInput }),
    });
    setFavorite(movieInput);
    setShowMovieForm(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <img
          src={session.user.image!}
          alt="Profile"
          width={80}
          height={80}
          style={{ borderRadius: "50%", marginBottom: "15px" }}
        />
        <h2>{session.user.name}</h2>
        <p>{session.user.email}</p>
        <button 
          onClick={() => signOut()}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#dc3545", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          Logout
        </button>
      </div>

      {!favorite && showMovieForm && (
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", backgroundColor: "white" }}>
          <h3>What's your favorite movie?</h3>
          <form onSubmit={handleSaveMovie}>
            <input
              type="text"
              value={movieInput}
              onChange={e => setMovieInput(e.target.value)}
              placeholder="Enter movie name"
              required
              style={{ padding: "8px", marginRight: "10px", width: "200px" }}
            />
            <button 
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Save
            </button>
          </form>
        </div>
      )}

      {favorite && (
        <div style={{ padding: "20px", border: "1px solid #ddd" }}>
          <h3>Fun Fact about "{favorite}"</h3>
          <p>{fact || "Loading a fresh fact…"}</p>
        </div>
      )}
    </div>
  );
}