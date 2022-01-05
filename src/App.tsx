import './App.css';
import { useState, useEffect, useMemo } from 'react'
import { csv } from 'd3-request';
import DropdownList from './components/DropdownList'
import styled from 'styled-components'
import Sessions, {TherapistItemProps} from './components/Sessions'
import moment from 'moment';

// interface FilterProps {
//   [key:string]: string[]
// }

const Container = styled.div`
  display:flex;
  margin: 24px;
`;

function App() {
  const [results, setResults] = useState([])
  const [therapist, setTherapists] = useState([] as string[])
  const [filters, setFilters] = useState({durations: [] as string[], therapists:[] as string[]})
  
  useEffect(() => {
    csv('./schedules.csv', (_, data:any) => {
      const result = data.reduce((acc:TherapistItemProps, current: TherapistItemProps) => {
        // current has a key value, key value is the sam so only destruct values. Keys could also be used.
        const [id, session, time] = Object.values(current)// destruct 
        const formattedTime = moment(new Date(time)).format('LLLL')// format time, for filter purpose.

        // create a new list if doesn't exist where index is the therapist id
        if(!acc[id]) {
          acc[id] = []
        }
        
        if(acc[id].length < 20) {// only load only 20 (demo purpose)
          // append session and formatted time
          acc[id] = [...acc[id], { session, time: formattedTime }]
        }
        return acc
      }, [])
      setResults(result)// set result for filter purpose
      setTherapists(Object.keys(result).map((therapist) => therapist).sort((a:string, b:string) => Number(a) - Number(b)))// sort therapists
    })
  }, [])

  const onSelectTherapist = ({id, value}:{id:string, value:string}) => {// id is for example therapist, value is therapist id
    if(filters[id].includes(value)){//check for example if filter therapist has a value, if it doesn't, add it otherwise remove it (toggle function in the app)
      setFilters({...filters, ...{[id]: filters[id].filter((v:string) => v !== value)}})
    } else {
      setFilters({...filters, ...{[id]: [...filters[id], value]}})
    }
  }

  const renderSessions = useMemo(() => {// cache
    if(filters.therapists.length === 0 || filters.durations.length === 0) return null // early return if no filters

    return filters.therapists.map((v:string, index) => {// new fix, filter on filter therapist
      const newTherapist = results[v].filter((v:TherapistItemProps)=> filters.durations.includes(v.session.toString()))
      const sortedList = newTherapist.sort((a:TherapistItemProps, b:TherapistItemProps) => new Date(a.time).getTime() - new Date(b.time).getTime())
      return <Sessions key={index} therapist={v} sessions={sortedList} />
    })
    // const sessions = Object.keys(results).reduce((acc:FilterProps[], current:string) => {// itterate
    //   if(filters.therapists.includes(current)) {// check if therapist is in the list
    //     const time = results[current].filter((h:TherapistItemProps) => filters.durations.includes(h.session.toString()))// filter out duration(s) in therapist list
    //     acc = [...acc, {[current]:time.map((j:TherapistItemProps) => j.time).sort((a:string, b:string) => {
    //       return new Date(a).getTime() - new Date(b).getTime()
    //     })}]// sort
    //   }
    //   return acc
    // }, [])
    // return sessions
    // return sessions.map((session, index) => {// render sessions
    //   const therapist = '6'//Object.keys(session)[0]
    //   const sessions = session[therapist]
    //   return (
    //     <Sessions key={index} therapist={therapist} sessions={sessions} />
    //   )
    // })
  }, [results, filters])
  
  return (
    <div className="App">
      {results && (
        <Container>
          <DropdownList title="Therapist" id="therapists" filters={filters['therapists']} list={ therapist } onSelect={onSelectTherapist}/>
          <DropdownList title="Duration" id="durations" filters={ filters['durations'] } list={ ['30', '60'] } onSelect={onSelectTherapist}/>
          {renderSessions}
        </Container>
      )}
    </div>
  );
}

export default App;
