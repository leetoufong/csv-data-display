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
                const json = await convertCSVtoJSON(text);
            }
            catch(error) {
                // handle errors
            }
            finally {
                setLoading(false);
            }
        };

        fetchCSV();
    }, []);

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

    const fileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                convertCSVtoJSON(e.target.result);
            };

            // Read the file as text
            // You can use other methods like readAsDataURL for images/other files
            reader.readAsText(file);
        }
    };

    const convertCSVtoJSON = (data) => {
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        setHeadings(headers)
        setData(result)
    };

    return (
        <div className="App">
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="p-5">
                    <h1 className="text-2xl font-bold mb-3">Fetch, Parse & Display CSV Data</h1>
                    
                    <div className="mb-5">
                        <label htmlFor="upload" className="mr-3">Upload a <code>.CSV</code> file:</label>
                        <input
                            id="upload"
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            accept=".csv, text/csv"
                            onChange={(event) => {
                                fileChange(event)
                            }}
                        />
                    </div>

                    <table className="border-collapse w-full">
                        <thead className="text-left">
                            <tr>
                                {headings.map((item, i) => (
                                    <th className="border p-2 font-bold bg-blue-200" key={i}>{item}&nbsp;<button onClick={() => handleSort(item)}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 322 511.21"><path fillRule="nonzero" d="M295.27 211.54H26.71c-6.23-.02-12.48-2.18-17.54-6.58-11.12-9.69-12.29-26.57-2.61-37.69L144.3 9.16c.95-1.07 1.99-2.1 3.13-3.03 11.36-9.4 28.19-7.81 37.58 3.55l129.97 157.07a26.65 26.65 0 0 1 7.02 18.06c0 14.76-11.97 26.73-26.73 26.73zM26.71 299.68l268.56-.01c14.76 0 26.73 11.97 26.73 26.73 0 6.96-2.66 13.3-7.02 18.06L185.01 501.53c-9.39 11.36-26.22 12.95-37.58 3.55-1.14-.93-2.18-1.96-3.13-3.03L6.56 343.94c-9.68-11.12-8.51-28 2.61-37.69 5.06-4.4 11.31-6.56 17.54-6.57z"/></svg></button></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => {
                                return (
                                    <tr className="hover:bg-slate-100" key={i}>
                                        {Object.keys(item).map((datum, j) => (
                                            <td className="border p-2" key={j}>{item[datum]}</td>
                                        ))}
                                    </tr>
                                )
                            } )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
