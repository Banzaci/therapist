export interface TherapistItemProps {
  session: number
  time: string
}

interface TherapistProps {
  therapistId: number
  props: TherapistItemProps[]
}

function Therapist({ therapistId }:TherapistProps) {
  return (
    <div>
      <div>{therapistId}</div>
    </div>
  );
}

export default Therapist;
