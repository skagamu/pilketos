import { supabase } from '../lib/supabase'

export const fetchCandidates = async () => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('candidate_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching candidates:', error)
    return []
  }
  return data
}

export const submitVote = async (candidateId) => {
  const { error } = await supabase
    .from('votes')
    .insert([{ candidate_id: candidateId }])
    
  if (error) {
    console.error('Error submitting vote:', error)
    throw error
  }
}

// For Dashboard
export const fetchVoteCounts = async () => {
  // Using a simple select to count votes per candidate
  // A better way for large scale is an RPC, but this works for OSIS scale (few hundred votes)
  const { data, error } = await supabase
    .from('votes')
    .select('candidate_id')
    
  if (error) {
    console.error('Error fetching votes:', error)
    return {}
  }
  
  // Tally the votes
  const tally = {}
  data.forEach(vote => {
    tally[vote.candidate_id] = (tally[vote.candidate_id] || 0) + 1
  })
  
  return tally
}