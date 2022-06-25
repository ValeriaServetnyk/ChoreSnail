// api to store participants names and their emails

export default function handler(req, res) {
  res.status(200).json({ participants: 'http://localhost:3000/api/participants' })
}
