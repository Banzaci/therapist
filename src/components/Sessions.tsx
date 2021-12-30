import styled from 'styled-components'

interface SessionsProps {
  therapist: string
  sessions: string[]
}

const Container = styled.div`
  margin-left: 32px;
`;

const UL = styled.ul`
  list-style-type: none;
  padding:0;
  margin: 0;
`;

const LI = styled.li`
  padding: 12px 18px;
  text-align:left;
  background-color: #EEE;
  margin-top:1px;
`;

const Header = styled.div`
  padding: 12px 0;
  background-color: #EEE;
  font-weight:bold;
`;
 

function Sessions({ therapist, sessions }:SessionsProps) {
  return (
    <Container>
      <Header>Therapist {therapist}</Header>
      <UL>
        { sessions.map((session:string, index:number) => <LI key={index}>{session}</LI>) }
      </UL>
    </Container>
  );
}

export default Sessions;
