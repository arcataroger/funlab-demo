import Head from 'next/head'
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en);

const REVALIDATION_PERIOD = 60;

export default function Home(props) {
    const {data, age, fetchDate} = props;

    const relativeTimeFormatter = new TimeAgo('en-US')
    const fetchDateParsed = new Date(fetchDate);
    const fetchDateISO = fetchDateParsed.toISOString();

    return (
        <div>
            <Head>
                <title>Next 12 ISR Test</title>
            </Head>

            <main>
                <h1>
                    Next 12 ISR Test
                </h1>

                <p>Content age:<code> {age} seconds
                    ({relativeTimeFormatter.format(fetchDateParsed - (age * 1000), 'mini-minute')} before fetch)</code></p>
                <p>Fetch date: <code>{fetchDateISO}</code></p>
                <p>Revalidate set to: <code>{REVALIDATION_PERIOD}</code>s
                </p>
                <h2>API request body from getStaticProps()</h2>
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
        revalidate: REVALIDATION_PERIOD,
    }
})


