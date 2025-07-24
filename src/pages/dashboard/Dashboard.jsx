import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const BASE_URL = 'http://localhost:8000/'

function Dashboard() {
  const [difficulty, setDifficulty] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const [timeLeft, setTimeLeft] = useState(0)
  const [typingInput, setTypingInput] = useState('')
  const [typingActive, setTypingActive] = useState(false)

  const [gameResults, setGameResults] = useState(null)

  const startGame = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPrompt('')
    setGameStarted(false)
    setGameResults(null)
    setTimeLeft(0)
    setTypingInput('')
    setTypingActive(false)

    if (!difficulty || !totalTime) {
      setError('> ERROR: Select both difficulty and time to launch mission.')
      setLoading(false)
      return
    }

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }

      const payload = {
        difficulty,
        total_time: totalTime,
      }

      const res = await axios.post(`${BASE_URL}api/ai-typing/prompt/`, payload, { headers })
      setPrompt(res.data.text)
      setGameStarted(true)
      setTimeLeft(parseInt(totalTime))
      setTypingActive(true)
    } catch (err) {
      setError(`> ERROR: ${err.response?.data?.error || 'Unable to launch mission.'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!typingActive) return
    if (timeLeft === 0) {
      setTypingActive(false)
      submitGameResults()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, typingActive])

  const submitGameResults = async () => {
    const promptWords = prompt.trim().split(/\s+/)
    const typedWords = typingInput.trim().split(/\s+/)
    let correct = 0

    for (let i = 0; i < Math.min(promptWords.length, typedWords.length); i++) {
      if (promptWords[i] === typedWords[i]) {
        correct++
      }
    }

    const payload = {
      correct_words: correct,
      total_words: typedWords.length,
      time_taken: parseInt(totalTime),
    }

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }

      const res = await axios.post(`${BASE_URL}api/results/create/`, payload, { headers })
      setGameResults(res.data)
    } catch (err) {
      console.error('Error submitting results:', err)
      setError('> ERROR: Could not save results to command center.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        {!gameStarted && !gameResults && (
          <>
            <p className="mb-4 text-green-300">> SYSTEM READY. Configure mission parameters below:</p>
            <form onSubmit={startGame} className="space-y-4">
              <div>
                <label className="block">> Difficulty Level:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-black border border-green-500 text-green-300 px-2 py-1 w-full"
                >
                  <option value="">-- Select Difficulty --</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block">> Mission Duration:</label>
                <select
                  value={totalTime}
                  onChange={(e) => setTotalTime(e.target.value)}
                  className="bg-black border border-green-500 text-green-300 px-2 py-1 w-full"
                >
                  <option value="">-- Select Time --</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">120 seconds</option>
                </select>
              </div>

              <button
                type="submit"
                className="border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition"
                disabled={loading}
              >
                {loading ? '> Initiating...' : '> START MISSION'}
              </button>
            </form>

            {error && <pre className="mt-6 text-red-400 whitespace-pre-wrap">{error}</pre>}
          </>
        )}

        {gameStarted && (
          <div className="mt-6 border-t border-green-500 pt-4">
            <p className="mb-2">> MISSION BRIEFING:</p>
            <pre className="whitespace-pre-wrap bg-black text-green-300 p-4 border border-green-400 rounded">
              {prompt}
            </pre>

            <div className="mt-4">
              <p className="text-yellow-300">
                > Begin typing now! Time remaining: <span className="font-bold">{timeLeft}s</span>
              </p>

              {typingActive && (
                <textarea
                  className="mt-2 w-full bg-black border border-green-400 text-green-200 p-2"
                  rows="6"
                  value={typingInput}
                  onChange={(e) => setTypingInput(e.target.value)}
                  placeholder=">>> Start typing mission content here..."
                />
              )}
            </div>
          </div>
        )}

        {gameResults && (
          <div className="mt-6 border-t border-green-500 pt-4 animate-fadeIn">
            <p className="mb-4 text-green-300">> MISSION DEBRIEF:</p>
            <div className="bg-black border border-green-400 p-6 rounded space-y-2">
              <p>> Agent: <span className="text-green-200">{gameResults.player}</span></p>
              <p>> Words Per Minute: <span className="text-green-200">{gameResults.wpm}</span></p>
              <p>> Accuracy: <span className="text-green-200">{gameResults.accuracy}%</span></p>
              <p>> Correct Words: <span className="text-green-200">{gameResults.correct_words}</span></p>
              <p>> Total Words: <span className="text-green-200">{gameResults.total_words}</span></p>
              <p>> Time Taken: <span className="text-green-200">{gameResults.time_taken}s</span></p>
              <p>> Mission ID: <span className="text-green-200">{gameResults.id}</span></p>
            </div>

            <div className="mt-6">
              <p className="text-green-300 mb-2">> VISUAL ANALYTICS:</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'WPM', value: gameResults.wpm },
                  { name: 'Accuracy', value: gameResults.accuracy },
                  { name: 'Correct', value: gameResults.correct_words },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2f855a" />
                  <XAxis dataKey="name" stroke="#9ae6b4" />
                  <YAxis stroke="#9ae6b4" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#38a169' }} />
                  <Bar dataKey="value" fill="#48bb78" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
