import { useEffect, useState } from "react";
import api from "../../services/api";
import "./style.css";

function Calendar() {
    const [appointments, setAppointments] = useState<any[]>([]);

    async function fetchData() {
        try {
            const response = await api.get("/appointments");

            console.log("DATA:", response.data);
            console.log("É array?", Array.isArray(response.data));

            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Calendar -------------------------------------------------
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

    let currentMonth: number = currentDate.getMonth();
    let currentYear: number = currentDate.getFullYear();

    let firstDayIndex: number = new Date(currentYear, currentMonth, 1).getDay();
    let lastDayPrevMonth: number = new Date(currentYear, currentMonth, 0).getDate();

    let totalDaysInMonth: number = new Date(currentYear, currentMonth + 1, 0).getDate();
    console.log(totalDaysInMonth);

    let totalNumCalendar: number = firstDayIndex + totalDaysInMonth;

    // notes ---------------------------------------------------

    const selectedAppointments = appointments
        .filter(appointment => {
            const appointmentDate = new Date(appointment.startAt);

            return (
                appointmentDate.getDate() === selectedDate &&
                appointmentDate.getMonth() === currentMonth &&
                appointmentDate.getFullYear() === currentYear
            );
        })
        .sort((a, b) => {
            const statusOrder = ["scheduled", "waiting", "completed", "canceled"];
            if (a.status === b.status) {
                return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
            }
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

    return (
        <div className="calendar-notes">
            <div className="calendar">
                <div className="calendar-header">
                    <div className="calendar-header month">
                        <button
                            className="calendar-header_button"
                            onClick={() => {
                                console.log("Previous month button clicked");
                                currentMonth--;
                                let newDate = new Date(currentYear, currentMonth);
                                setCurrentDate(newDate);
                            }}
                        >
                            &lt;
                        </button>
                        {currentDate.toLocaleDateString("PT-BR", { month: "long", year: "numeric" })}
                        <button
                            className="calendar-header_button"
                            onClick={() => {
                                console.log("Next month button clicked");
                                currentMonth++;
                                let newDate = new Date(currentYear, currentMonth);
                                setCurrentDate(newDate);
                            }}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="calendar-header_days">
                        <div className="calendar-header_day weekend">dom.</div>
                        <div className="calendar-header_day">seg.</div>
                        <div className="calendar-header_day">ter.</div>
                        <div className="calendar-header_day">qua.</div>
                        <div className="calendar-header_day">qui.</div>
                        <div className="calendar-header_day">sex.</div>
                        <div className="calendar-header_day weekend">sáb.</div>
                    </div>
                </div>
                {
                    <div className="calendar-body">
                        {Array.from({ length: firstDayIndex }, (_, index) => (
                            <button disabled key={index} className="calendar-body_day empty">
                                {lastDayPrevMonth + index - firstDayIndex + 1}
                            </button>
                        ))}
                        {Array.from({ length: totalDaysInMonth }, (_, index) => {
                            // Function to check if the day is today
                            function isToday(day: number): boolean {
                                const today = new Date();
                                return (
                                    day === today.getDate() &&
                                    currentMonth === today.getMonth() &&
                                    currentYear === today.getFullYear()
                                );
                            }

                            // Function to check if the day is a weekend
                            function isWeekend(day: number): boolean {
                                const date = new Date(currentYear, currentMonth, day);
                                const dayOfWeek = date.getDay();
                                return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
                            }

                            function isSelected(day: number): boolean {
                                return day === selectedDate;
                            }

                            return (
                                <button
                                    onClick={() => setSelectedDate(index + 1)}
                                    key={index}
                                    className={
                                        "calendar-body_day" +
                                        (isToday(index + 1) ? " today" : "") +
                                        (isWeekend(index + 1) ? " weekend" : "") +
                                        (isSelected(index + 1) ? " selected" : "")
                                    }
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                        {Array.from({ length: 42 - totalNumCalendar }, (_, index) => (
                            <button disabled key={index} className="calendar-body_day empty">
                                {index + 1}
                            </button>
                        ))}
                    </div>
                }
            </div>
            <div className="notes">
                <div className="notes-header">
                    <h2>Agenda do dia {selectedDate}</h2>
                </div>
                <div className="notes-body">
                    {selectedAppointments.length === 0 ? (
                        <p>Agenda vazia</p>
                    ) : (
                        selectedAppointments.map(appointment => (
                            <div key={appointment.id} className={"noted " + appointment.status}>
                                <div className="hour">
                                    <h1>
                                        {new Date(appointment.startAt).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            timeZone: "UTC",
                                        })}
                                    h</h1>
                                    <p>R$ {appointment.totalAmount},00</p>
                                </div>
                                <div className="noted-info">
                                    {appointment.status === "scheduled" ? (
                                        <>
                                            <i className="ti ti-message-2-exclamation"></i>
                                            <p>Agendado</p>
                                        </>
                                    ) : appointment.status === "completed" ? (
                                        <>
                                            <i className="ti ti-check"></i>
                                            <p>Concluído</p>
                                        </>
                                    ) : appointment.status === "cancelled" ? (
                                        <>
                                            <i className="ti ti-x"></i>
                                            <p>Cancelado</p>
                                        </>
                                    ) : appointment.status === "waiting" ? (
                                        <>
                                            <i className="ti ti-clock"></i>
                                            <p>Aguardando</p>
                                        </>
                                    ) : (
                                        <p>Desconhecido</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
