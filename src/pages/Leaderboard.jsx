import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const Leaderboard = ({ currentScore = 0, onClose }) => {
  // Get leaderboard from localStorage
  const getStoredLeaderboard = () => {
    const stored = localStorage.getItem("pacmanLeaderboard");
    return stored ? JSON.parse(stored) : [];
  };

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  // Check if current score qualifies for leaderboard
  useEffect(() => {
    if (currentScore > 0) {
      const stored = getStoredLeaderboard();
      if (
        stored.length < 10 ||
        currentScore > stored[stored.length - 1]?.score
      ) {
        setShowNameInput(true);
      }
    }
  }, [currentScore]);

  const fetchLeaderboard = () => {
    setLoading(true);
    try {
      const stored = getStoredLeaderboard();

      // Filter based on date
      const now = new Date();
      let filtered = stored;

      if (filter === "today") {
        filtered = stored.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.toDateString() === now.toDateString();
        });
      } else if (filter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = stored.filter((entry) => new Date(entry.date) >= weekAgo);
      } else if (filter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = stored.filter((entry) => new Date(entry.date) >= monthAgo);
      }

      // Add rank numbers
      const rankedData = filtered.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      setLeaderboard(rankedData);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      // Use demo data if localStorage fails
      setLeaderboard([
        {
          rank: 1,
          username: "DemoPlayer1",
          score: 10000,
          date: new Date().toISOString(),
        },
        {
          rank: 2,
          username: "DemoPlayer2",
          score: 8500,
          date: new Date().toISOString(),
        },
        {
          rank: 3,
          username: "DemoPlayer3",
          score: 7200,
          date: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveScore = () => {
    if (!playerName.trim()) return;

    const stored = getStoredLeaderboard();
    const newEntry = {
      username: playerName,
      score: currentScore,
      date: new Date().toISOString(),
    };

    // Add new entry and sort
    const updated = [...stored, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100); // Keep top 100

    localStorage.setItem("pacmanLeaderboard", JSON.stringify(updated));
    setShowNameInput(false);
    fetchLeaderboard();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-gray-900 border-maze-blue">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center text-yellow-400">
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add score input if player made the leaderboard */}
        {showNameInput && currentScore > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-yellow-400">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">
              Congratulations! Score: {currentScore.toLocaleString()}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
              <button
                onClick={saveScore}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 transition-colors"
              >
                Save Score
              </button>
            </div>
          </div>
        )}

        {/* Filter buttons */}
        <div className="flex justify-center mb-6 space-x-2">
          {["all", "today", "week", "month"].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === period
                  ? "bg-yellow-400 text-gray-900 font-bold"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {period === "all" ? "All Time" : period}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No scores yet for this period.</p>
            <p className="mt-2">Be the first to set a high score!</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300">Rank</th>
                  <th className="px-6 py-3 text-left text-gray-300">Player</th>
                  <th className="px-6 py-3 text-right text-gray-300">Score</th>
                  <th className="px-6 py-3 text-right text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-700 hover:bg-gray-700 transition-colors ${
                      index < 3 ? "bg-opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {entry.username}
                    </td>
                    <td className="px-6 py-4 text-right text-yellow-400 font-bold">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Close button if used as modal */}
        {onClose && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
