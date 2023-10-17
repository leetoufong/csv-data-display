import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [headings, setHeadings] = useState([]);
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchCSV = async () => {
            try {
                const response = await fetch('./sample.csv');
                const text = await response.text();
                console.log(text)
                const json = await handleCSVToJSON(text);

                setData(json);
                const newHeadings = [];

                for (let key in json[0]) {
                    if (newHeadings.indexOf(key) < 0) {
                        newHeadings.push(key)
                    }
                }

                setHeadings(newHeadings);
            }
            catch(error) {

            }
            finally {
                setLoading(false);
            }
        };

        fetchCSV();
    }, []);

    const handleCSVToJSON = (data, delimiter = ',') => {
        const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
        return data
            .slice(data.indexOf('\n') + 1)
            .split('\n')
            .map(v => {
                const values = v.split(delimiter);
                return titles.reduce(
                    (obj, title, index) => ((obj[title] = values[index]), obj), {}
                );
            });
    };

    const handleSort = (type) => {
        const newUserList = data;

        setAscending(!ascending);

        newUserList.sort((a, b) => {
            if (ascending) {
                // then sort descending
                if (a[type] > b[type]) {
                    return -1;
                }
                if (b[type] > a[type]) {
                    return 1;
                }
            } else {
                // sort back ascending
                if (a[type] < b[type]) {
                    return -1;
                }
                if (b[type] < a[type]) {
                    return 1;
                }
            }
            
            return 0;
        });

        setData(newUserList);
    };

    return (
        <div className="App">
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-3">Fetch, Parse & Display CSV Data</h1>

                    <table className="border-collapse w-full">
                        <thead className="text-left">
                            <tr>
                                {headings.map((item, index) => (
                                    <th className="border p-2 font-bold bg-blue-200" key={index}>{item} <button onClick={() => handleSort(item)}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 322 511.21"><path fill-rule="nonzero" d="M295.27 211.54H26.71c-6.23-.02-12.48-2.18-17.54-6.58-11.12-9.69-12.29-26.57-2.61-37.69L144.3 9.16c.95-1.07 1.99-2.1 3.13-3.03 11.36-9.4 28.19-7.81 37.58 3.55l129.97 157.07a26.65 26.65 0 0 1 7.02 18.06c0 14.76-11.97 26.73-26.73 26.73zM26.71 299.68l268.56-.01c14.76 0 26.73 11.97 26.73 26.73 0 6.96-2.66 13.3-7.02 18.06L185.01 501.53c-9.39 11.36-26.22 12.95-37.58 3.55-1.14-.93-2.18-1.96-3.13-3.03L6.56 343.94c-9.68-11.12-8.51-28 2.61-37.69 5.06-4.4 11.31-6.56 17.54-6.57z"/></svg></button></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => (
                                <tr className="hover:bg-slate-100" key={i}>
                                    {Object.keys(item).map((datum) => (
                                        <td className="border p-2">{item[datum]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default App;
