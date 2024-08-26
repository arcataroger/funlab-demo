import Head from 'next/head'
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en);

export default function Home(props) {
    const {data, age, fetchDate} = props;

    const relativeTimeFormatter = new TimeAgo('en-US')

    return (
        <div>
            <Head>
                <title>Next 12 ISR Test</title>
            </Head>

            <main>
                <h1>
                    Next 12 ISR Test
                </h1>

                <h2>API data from getStaticProps()</h2>
                <p>Fetched: {fetchDate} ({relativeTimeFormatter.format(Date.parse(fetchDate))})<br/>
                    Content age: {age} seconds ({relativeTimeFormatter.format(Date.parse(fetchDate) - (age * 1000))})
                </p>
                <pre>
                    <code>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>


            </main>

        </div>
    )
}

export const getStaticProps = (async () => {

    //language=gql
    const query = `
        query SimpleQuery {
            exampleModel {
                textField
            }
        }
    `

    const response = await fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.DATOCMS_READ_ONLY_API_TOKEN}`,
        },
        body: JSON.stringify({query}),
    })
    const data = await response.json()

    return {
        props: {data, fetchDate: response.headers.get('date'), age: response.headers.get('age')},
        revalidate: 1,
    }
})


