const https = require('https')

module.exports = async (req, res) => {
    const unidade = req.query.cidade
    const datas = await get(
        `https://www.portalcoren-rs.gov.br/assets/ajax/agendamento_datas_atendimento_ajax.php?cdLocalAtendimento=${unidade}&ajax=true`
    )

    const datasComHorario = await Promise.all(
        datas.map(async (data) => {
            const [dia, mes, ano] = data.dtAtendimento.split('/')
            const horarios = await get(
                `https://www.portalcoren-rs.gov.br/assets/ajax/agendamento_horas_atendimento_ajax.php?cdLocalAtendimento=${unidade}&dtAtendimento=${dia}%2F${mes}%2F${ano}&ajax=true`
            )
            data['horarios'] = horarios

            return new Promise((resolve) => {
                resolve(data)
            })
        })
    )
    res.json(datasComHorario)
}

function get(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (resp) => {
                let data = ''
                resp.on('data', (chunk) => {
                    data += chunk
                })
                resp.on('end', () => {
                    resolve(JSON.parse(data))
                })
            })
            .on('error', (err) => {
                reject(err.message)
            })
    })
}
