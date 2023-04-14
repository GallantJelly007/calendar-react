import { useState,useRef} from 'react'
import styled from 'styled-components'
import Time from './time.js'



const AppContainer = styled.div`
  background-color: #f6f6f6;
  height: 100vh;
  max-width: 740px;
	margin:0 auto;
  display: flex;
  flex-direction: column;
`

const CalendarHeader=styled.div`
  height:5rem;
  background-color:#fff;
  width:100%;
  box-shadow:0 0.2rem 0.2rem rgba(0,0,0,0.05);
  z-index:10;
  padding:2rem;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #e6e6e6;
`

const HeaderH = styled.h1`
  font-weight:400;
  font-size:1.8rem;
`

const Button = styled.button`
  background-color:${props=>props.bgColor?props.bgColor:'transparent'};
  border:none;
  display:flex;
  cursor:pointer;
  justify-content:center;
  align-items:center;
  font-size:${props=>props.fontSize};
  font-weight:bold;
  transition:background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
  color:${props=>props.color};
  &:hover{
    color:${props=>props.hoverColor?props.hoverColor:props.color};
    background-color:${props=>props.bgHoverColor};
    box-shadow:0 0 0.3rem 0.1rem rgba(0,0,0,0.15);
  }
`

const CircleButtonContainer = styled(Button)`
  line-height:1;
  text-align:center;
  font-weight:300;
  width:1em;
  height:1em;
  border-radius:50%;
  padding:${props=>props.padding?props.padding:'0.7em'};
`

const FooterButton = styled(Button)`
  color:#ff3131;
  font-weight:500;
  flex:1;
  height:100%;
  padding:1rem 4rem;
`

const FooterButtonLeft=styled(FooterButton)`
  justify-content:flex-start;
  max-width:50%;
`

const FooterButtonRightContainer=styled(FooterButton)`
  display:${props=>props.hide===true?'none':'inherit'};
  justify-content:flex-end;
`

const Footer = styled.footer`
  box-shadow:0 -0.2rem 0.2rem rgba(0,0,0,0.05);
  height:4rem;
  z-index:10;
  display:flex;
  border-top:1px solid #e6e6e6;
  background-color: #f6f6f6;
`
const ControlContainer = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  width:100%;
  padding: 1rem 1.4rem 1rem 6rem;
`
const DivAround=styled.div`
  display:flex;
  justify-content:space-around;
  width:100%;
  &+&{
    margin-top:0.5rem;
  }
`
const Label = styled.p`
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:600;
  font-size:${(props)=>props.fontSize};
  flex:1;
`

const TableCellContainer = styled.div`
  height:3rem;
  width:100%;
  flex:1;
  padding:0.15rem;
  border-left:1px solid #ccc;
  &:last-child{
    border-right:1px solid #ccc;
  }
`
const InputCell = styled.input.attrs({ type: "radio" })`
  transition:background-color 0.2s ease-in-out; 
  background-color:#eef;
  height:100%;
  width:100%;
  appearance: none;
  &:checked{
    background-color:#b3b7ff;
  }
  &:disabled{
    background-color:white;
  }
`
const InnerCell = styled.div`
  background-color:#f6f6f6;
  height:100%;
  width:100%;
`

const CalendarContainer=styled.div`
  display:flex;
  flex-direction:column;
  flex:1;
  overflow:hidden;
`

const CalendarTable=styled.div`
  border-collapse:collapse;
  flex:1;
  width:100%;
  overflow-y:scroll;
  background-color:white;
  padding-left:4rem;
  -ms-overflow-style: none;  
  scrollbar-width: none;
  box-shadow:0 -0.2rem 0.2rem rgba(0,0,0,0.05);
`

const TableRow = styled.div`
  width:100%;
  height:3rem;
  display:flex;
  padding:0 1rem;
  position:relative;
  &+&{
    border-top:1px solid #ccc;
  }    
`

const TableRightLegendItem=styled.div`
  display:flex;
  position:absolute;
  line-height:1;
  color:#c0c0c0;
  height:1rem;
  width:5rem;
  font-weight:500;
  left:-3rem;
  top:-0.5em;
`
const DayButtonContainer = styled(CircleButtonContainer)`
  font-weight:600;
  &:disabled{
    background-color:#f6f6f6;
  }
`


Time.setDefaultTz(Time.TIMEZONE.plus_6)

let eventsTime=[]
let data = localStorage.getItem('events')
if(data!==undefined&&data!=null){
  eventsTime = JSON.parse(data)
}
let currentEvent=null
let calendarSetState
let deleteSetState

const saveLocalStorage=()=>{
  localStorage.setItem('events',JSON.stringify(eventsTime))
}

function App() {
  const addEvent=()=>{
    let str = prompt('Enter event time:\nYYYY-MM-DD HH:mm:ss')
    try{
      if(!/^([0-9]{4})-(0[1-9]|1[0-2])-(0[0-9]|[1-2][0-9]|3[0-1])([T ]{1})(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(str)){
        throw new Error('Time format exception')
      }
      let time = new Time(str)
      if(eventsTime.findIndex(el=>time.equalsDate(el)&&time.equalsHour(el))!==-1){
        alert('An event for the specified hour has already been created')
      }else{
        eventsTime.push(time)
        saveLocalStorage()
        calendarSetState(false,null,true)
        deleteSetState(true)
        currentEvent=null
        alert('Event saved successfully')
      }
    }catch(err){
      alert(err.message)
    }
  }

  const deleteEvent=()=>{
    if(currentEvent!==null){
      if(window.confirm('Are you sure you want to delete the event?')){
        eventsTime.splice(currentEvent,1)
        saveLocalStorage()
        calendarSetState(false,null,true)
        alert('Event deleted successfully')
        deleteSetState(true)
        currentEvent=null
      }
    }
  }

  return (
    <AppContainer>
      <CalendarHeader>
        <HeaderH>
          Interview Calendar
        </HeaderH>
        <CircleButton onClick={addEvent} fontSize='3rem' bgHoverColor='#f5f5ff' color='#ff3131'>
          +
        </CircleButton>
      </CalendarHeader>
      <Calendar getStateFunc={(setState)=>calendarSetState=setState} currentDate={new Time()}>

      </Calendar> 
      <Footer>
        <FooterButtonLeft 
          onClick={()=>{calendarSetState(false,new Time())
                        currentEvent=null
                        deleteSetState(true)}} 
          fontSize='1.4rem' 
          bgHoverColor='#e6e6e6'>
          Today
        </FooterButtonLeft>
        <FooterButtonRight onClick={deleteEvent} getStateFunc={((setState)=>deleteSetState=setState)} fontSize='1.4rem' bgHoverColor='#e6e6e6'>
          Delete
        </FooterButtonRight>
      </Footer>
    </AppContainer>
  );
}

function FooterButtonRight(props){
  const [state,setState]=useState(true)
  if(props.getStateFunc!==undefined&&typeof props.getStateFunc=='function'){
      props.getStateFunc(setState)
  }
  return(
    <FooterButtonRightContainer onClick={props.onClick} hide={state} fontSize={props.fontSize} bgHoverColor={props.bgHoverColor}>
        {props.children}
    </FooterButtonRightContainer>
  )
}

function DayButton(props){
  return(
    <DayButtonContainer fontSize='1.3rem' color={props.selected?'white':'black'} bgColor={props.selected?'#ff3131':'transparent'} padding='1.2rem'>{props.children}</DayButtonContainer>
  )
}

function CircleButton(props){
  return(
    <CircleButtonContainer onClick={props.onClick} fontSize={props.fontSize} bgColor={props.bgColor} bgHoverColor={props.bgHoverColor} color={props.color} hoverColor={props.hoverColor}>{props.children}</CircleButtonContainer>
  )
}

function Calendar(props){

  const [state,setState] = useState(true)
  const currentDate = useRef(props.currentDate)
  const totalDate = useRef({day:props.currentDate.day,
                            month:props.currentDate.month,
                            year:props.currentDate.year})

  const weekDays=[]
  for(let i = 1;i<=7;i++){
    let day = Time.getDayInWeekString(true,i,'en')
    weekDays.push(<Label fontSize='0.8rem' key={i}>{day[0].toUpperCase()}</Label>)
  }

  const daysMonth=[]
  
  let maxDay = currentDate.current.getMonthDayCount()
  let startDay = currentDate.current.day-(currentDate.current.dayOfWeek-1)
  daysMonth.splice(0,daysMonth.length)
  for(let i = startDay;i<startDay+7;i++){
    if(i>maxDay||i<1)
      daysMonth.push(<Label></Label>)
    else{
      daysMonth.push(<Label><DayButton selected={i===totalDate.current.day&&currentDate.current.month===totalDate.current.month&&currentDate.current.year===totalDate.current.year?true:false}>{i}</DayButton></Label>)
    }
  }
 
  const toggleWeek=(next=false,date=null,onlyChangeState=false)=>{
    if(!onlyChangeState){
      if(date!=null&&date instanceof Time)
        currentDate.current=date;
      else{
        let monthCount = Time.getMonthDayCount(currentDate.current.month,Time.isLeapYear(currentDate.current.year))
        if(next){
          if(currentDate.current.day+7>monthCount){
            let diff=monthCount-currentDate.current.day
            currentDate.current.addDay(diff+1)
          }else{
            currentDate.current.addDay(7)
          }
        }else{
          if(currentDate.current.day-7<1){
            let diff=currentDate.current.day
            currentDate.current.addDay(-diff-1)
          }else{
            currentDate.current.addDay(-7)
          }
        }
      }
    }
    setState(!state)
  }

  if(props.getStateFunc!==undefined&&typeof props.getStateFunc=='function'){
    props.getStateFunc(toggleWeek)
  }

  function TableCell(props){
    return(
      <TableCellContainer>
        {props.isInput?<InputCell name='eventCell' 
                                  value={props.value} 
                                  onClick={(event)=>{currentEvent=event.target.value
                                                      deleteSetState(currentEvent===-1)}} 

                                  disabled={props.disabled}
                                  >
                                    {props.children}</InputCell>
                      :<InnerCell></InnerCell>}
      </TableCellContainer>
    )
  }

  let hours=1;
  const rows = [];
  for (let i = 0; i < 24; i++) {
      let cells = []
      for(let j=startDay;j<startDay+7;j++){
        let index = eventsTime.findIndex(el=>el.year===currentDate.current.year
                      &&el.month===currentDate.current.month
                      &&el.day===j
                      &&el.hours===i)
        let disabled = index === -1
        cells.push(<TableCell isInput={!(j>maxDay||j<1)} disabled={disabled} value={!disabled?index:'-1'} key={j}></TableCell>)
      }
      rows.push(<TableRow key={i}>
        {i!==0?<TableRightLegendItem>
                  {(hours++).toString().padStart(2,'0')+':00'}
                </TableRightLegendItem>:''}
        {cells}
      </TableRow>)
  }
  return (
    <CalendarContainer>
      <ControlContainer>
      <DivAround>
        {weekDays}
      </DivAround>
      <DivAround>
        {daysMonth}
      </DivAround>
      <DivAround>
        <CircleButton onClick={()=>toggleWeek()} fontSize="1.2rem" padding='1.5rem'>{'❮'}</CircleButton>
        <Label fontSize='1rem'>{currentDate.current.getMonthString('en')} {currentDate.current.year}</Label>
        <CircleButton onClick={()=>toggleWeek(true)} fontSize="1.2rem" padding='1.5rem'>{'❯'}</CircleButton>
      </DivAround>
    </ControlContainer>
      <CalendarTable>
        {rows}
      </CalendarTable>
    </CalendarContainer>
  );
}

export default App;
