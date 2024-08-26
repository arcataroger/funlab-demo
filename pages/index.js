import Head from 'next/head'
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en); // Initializing the relative time formatter

const REVALIDATION_PERIOD = 60; // How often ISR should check for new content

export default function Home(props) {
    const {data, age, fetchDate} = props; // Data from getStaticProps

    const relativeTimeFormatter = new TimeAgo('en-US') // Used for "minutes ago" formatting
    const fetchDateParsed = new Date(fetchDate); // Transforming from our API's response to JS date
    const fetchDateISO = fetchDateParsed.toISOString(); // Standardizing output

    return (
        <div>
            <Head>
                <title>Next 12 ISR Test</title>
            </Head>

            <main>
                <h1>DatoCMS Next 12 ISR Test for Funlab & Netlify</h1>

                {/* Basic header & debug info */}
                <p>Content age:<code> {age} seconds
                    ({relativeTimeFormatter.format(fetchDateParsed - (age * 1000), 'mini-minute')} before fetch)</code></p>
                <p>Fetch date: <code>{fetchDateISO}</code></p>
                <p>Revalidate set to: <code>{REVALIDATION_PERIOD}</code>s</p>

                <h2>API request body from getStaticProps()</h2>

                {/* The actual API response that should change */}
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
        query ExampleQuery {
            exampleModel {
                textField # This is just a simple string, the only thing we care about
            }
        }
    `

    const response = await fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.DATOCMS_READ_ONLY_API_TOKEN}`,
        },
        body: JSON.stringify({query}),
    })
    const data = await response.json()

    return {
        props: {
            // Our data
            data,
            fetchDate: response.headers.get('date'),
            age: response.headers.get('age')},
        revalidate: REVALIDATION_PERIOD, // Next ISR
    }
})


