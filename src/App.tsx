import { useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'

interface IHorarios {
    cdDataAtendimento: string
    hrAtendimento: string
    fgDisponivel: string
}

interface IAgenda {
    dtAtendimento: string
    fgDisponivel: string
    horarios: IHorarios[]
}

export const App = () => {
    const [cidade, setCidade] = useLocalStorage<string>('@CIDADE', '')
    const [loading, setLoading] = useState<boolean>(false)
    const [agenda, setAgenda] = useState<IAgenda[] | null>()

    useEffect(() => {
        if (cidade) {
            setLoading(true)

            fetch(`/api/horarios?cidade=${cidade}`)
                .then((data) => {
                    return data.json()
                })
                .then((data) => {
                    setLoading(false)
                    setAgenda(data)
                })
        }
    }, [cidade])
    return (
        <div className='container' style={{ marginTop: '20px' }}>
            <div className='card'>
                <div className='card-header'>
                    <h5 className='card-title'>
                        <select
                            className='form-select'
                            aria-label='Default select example'
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                        >
                            <option value=''>SELECIONE</option>
                            <option value='1'>
                                Sede Porto Alegre (Registro e Cadastro)
                            </option>
                            <option value='5'>Subseção Caxias do Sul</option>
                            <option value='6'>Subseção Passo Fundo</option>
                            <option value='7'>Subseção Pelotas</option>
                            <option value='38'>
                                Subseção Santa Cruz do Sul
                            </option>
                            <option value='39'>Subseção Santa Maria</option>
                            <option value='37'>Subseção Santa Rosa</option>
                            <option value='36'>Subseção Uruguaiana</option>
                        </select>
                    </h5>
                    {cidade !== '' && !loading && (
                        <div className='d-grid gap-2'>
                            <a
                                // eslint-disable-next-line react/jsx-no-target-blank
                                target='_blank'
                                className='btn btn-outline-primary my-1'
                                href='https://www.portalcoren-rs.gov.br/index.php?categoria=servicos&pagina=agendamento'
                            >
                                Caso tenha agendamento, acesse por aqui
                            </a>
                        </div>
                    )}
                </div>
                {cidade === '' ? (
                    <div className='d-flex justify-content-center my-3'>
                        Nenhuma cidade selecionada
                    </div>
                ) : loading ? (
                    <div className='d-flex justify-content-center my-3'>
                        Lendo dados
                    </div>
                ) : (
                    <ul className='list-group list-group-flush'>
                        {agenda?.map((agenda: IAgenda) => {
                            return (
                                <li
                                    key={agenda.dtAtendimento}
                                    className='list-group-item'
                                >
                                    <strong>
                                        {agenda.dtAtendimento}
                                        {agenda.fgDisponivel === 'S' && (
                                            <> - Aberto</>
                                        )}
                                    </strong>
                                    <br />
                                    {agenda?.horarios.map((hora: IHorarios) => {
                                        if (hora.fgDisponivel === 'S') {
                                            return (
                                                <span
                                                    key={hora.hrAtendimento}
                                                    className='badge bg-primary me-2'
                                                >
                                                    {hora.hrAtendimento}
                                                </span>
                                            )
                                        }
                                        return (
                                            <span
                                                key={hora.hrAtendimento}
                                                className='badge bg-danger me-2'
                                                style={{ opacity: 0.4 }}
                                            >
                                                {hora.hrAtendimento}
                                            </span>
                                        )
                                    })}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}
