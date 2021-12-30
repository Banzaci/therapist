import { useState } from 'react'
import styled from 'styled-components'

interface ListProps {
  id:string
  list: string[]
  filters: string[]
  title:string;
  onSelect:(obj:{id:string, value:string}) => void
}

export interface ListItemProps {
  key:string
  value: string
}

export interface DropdownItemProps {
  [key:string]: ListItemProps[]
}

const Button = styled.div<{isOpen:boolean}>`
  background-color: ${({ isOpen }) => isOpen ? '#333' : '#EEE'};
  padding: 12px 0;
  cursor:pointer;
  color: ${({ isOpen }) => isOpen ? '#EEE' : '#333'};
  font-weight:bold;
`;

const UL = styled.ul<{isOpen:boolean}>`
  position:relative;
  display: ${({ isOpen }) => isOpen ? 'inline-block' : 'none'};
  max-height: 600px;
  overflow:hidden;
  overflow-y: auto;
  list-style-type: none;
  cursor:pointer;
  margin: 1px 0 0 0;
  padding:0;
`

const Li = styled.li<{selected:boolean}>`
  text-align:left;
  padding: 12px 28px;
  background-color: ${({ selected }) => selected ? '#DDD' : '#EEE'};
  margin-bottom:1px;
  border-bottom: 1px solid ${({ selected }) => selected ? '#CCC' : '#DDD'};
  :hover {
    background-color: #DDD;
  }
`

const Container = styled.div`
  width: 200px;
  margin-right:12px;
  display:flex;
  flex-direction: column;
`

function Dropdown({ list, onSelect, id, filters, title }:ListProps) {
  const [isOpen, setIsopen] = useState(true)
  
  const renderList = list.map((value:string, index:number) => {
    const onClick = () => onSelect({ id, value })
    const selected = filters.includes(value)
    return <Li key={index} selected={selected} onClick={onClick}>{value}</Li>
  })
  
  const onToggle = () => setIsopen(!isOpen)

  return (
    <Container>
      <Button isOpen={isOpen} onClick={onToggle}>{title}</Button>
      <UL isOpen={isOpen}>
        { renderList }
      </UL>
    </Container>
  );
}

export default Dropdown;