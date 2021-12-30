import './App.css';
import { useState, useEffect, useMemo } from 'react'
import { csv } from 'd3-request';
import DropdownList from './components/DropdownList'
import styled from 'styled-components'
import Sessions from './components/Sessions'
import moment from 'moment';

interface FilterProps {
  [key:string]: string[]
}

interface TherapistItemProps {
  session: Date
  time: string
}

const Container = styled.div`
  display:flex;
  margin: 24px;
`;

function App() {
  const [results, setResults] = useState([])
  const [therapist, setTherapists] = useState([] as string[])
  const [filters, setFilters] = useState({durations: [] as string[], therapist:[] as string[]})
  
  useEffect(() => {
    csv('./schedules.csv', (_, data:any) => {
      const result = data.reduce((acc:TherapistItemProps, current: TherapistItemProps) => {
        const [id, session, time] = Object.values(current)
        const formattedTime = moment(new Date(time)).format('LLLL')

        if(!acc[id]) {
          acc[id] = []
        }
        
        if(acc[id].length < 20) {

          acc[id] = [...acc[id], { session, time: formattedTime }]
        }

        return acc
      }, [])
      setResults(result)
      setTherapists(Object.keys(result).map((therapist) => therapist).sort((a:string, b:string) => Number(a) - Number(b)))
    })
  }, [])

  const onSelectTherapist = ({id, value}:{id:string, value:string}) => { 
    if(filters[id].includes(value)){
      setFilters({...filters, ...{[id]: filters[id].filter((v:string) => v !== value)}})
    } else {
      setFilters({...filters, ...{[id]: [...filters[id], value]}})
    }
  }

  const renderSessions = useMemo(() => {
    
    if(filters.therapist.length === 0 || filters.durations.length === 0) return null
    
    const a = Object.keys(results).reduce((acc:FilterProps[], current:string) => {
      if(filters.therapist.includes(current)) {
        const time = results[current].filter((h:TherapistItemProps) => filters.durations.includes(h.session.toString()))
        acc = [...acc, {[current]:time.map((j:TherapistItemProps) => j.time).sort((a:string, b:string) => {
          return new Date(a).getTime() - new Date(b).getTime()
        })}]
      }
      return acc
    }, [])

    return a.map((v) => {
      const therapist = Object.keys(v)[0]
      const sessions = v[therapist]
      return (
        <Sessions key={therapist} therapist={therapist} sessions={sessions} />
      )
    })
  }, [results, filters])
  
  return (
    <div className="App">
      {results && (
        <Container>
          <DropdownList title="Therapist" id="Therapist" filters={filters['therapist']} list={ therapist } onSelect={onSelectTherapist}/>
          <DropdownList title="Duration" id="durations" filters={ filters['durations'] } list={ ['30', '60'] } onSelect={onSelectTherapist}/>
          {renderSessions}
        </Container>
      )}
    </div>
  );
}

export default App;
