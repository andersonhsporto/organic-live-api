const PORT = process.env.PORT || 9001
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'folha',
        address: 'https://www1.folha.uol.com.br/folha-topicos/agricultura/#40',
        base: ''
    },
    {
        name: 'emais-estadao',
        address: 'https://emais.estadao.com.br/blogs/alimentos-organicos/',
        base: ''
    },
    {
        name: 'saude-estadao',
        address: 'https://saude.estadao.com.br/blogs/organicos/',
        base: '',
    },
    {
        name: 'exame',
        address: 'https://exame.com/noticias-sobre/produtos-organicos/',
        base: 'https://www.exame.com',
    },
    {
        name: 'agrolink',
        address: 'https://www.agrolink.com.br/noticias/',
        base: '',
    },
    {
        name: 'gauchazh',
        address: 'https://gauchazh.clicrbs.com.br/ultimas-noticias/tag/alimentos-organicos/',
        base: '',
    },
    {
        name: 'gov',
        address: 'https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos/noticias-organicos',
        base: '',
    },
    {
        name: 'g1',
        address: 'https://g1.globo.com/economia/agronegocios/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("orgânico")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to Organic News Live API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newsId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('Server running on port ' + PORT))
