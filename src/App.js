import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [chck, setChck] = useState(0);
  const [deleteT, setDelete] = useState('')

  useEffect(() => {
    getTransactions().then(setTransactions);
    if (deleteT !== '') {
      deleteTransaction();
    }
  }, [chck, deleteT])

  async function deleteTransaction() {
    try {
      const url = process.env.REACT_APP_API_URL + '/transactionDelete';
      const response = await axios.delete(url, {
        headers: { 'Content-Type': 'application/json' },
        data: { _id: deleteT }
      });
      console.log('Deleted Transaction:', response.data);
    } catch (error) {
      console.error('Error: ', error);
    }
    setDelete('');
  }

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      })
    })
      .then((response) => {
        response.json().then((json) => {
          getTransactions().then(setTransactions);
          setDatetime('');
          setName('');
          setDescription('');
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  let cents = 0;
  cents = Math.floor((balance - Math.floor(balance)) * 100);
  let total = 0;
  total = cents + balance;
  return (
    <div className='parent'>
      <h1 className='Title'>Money Tracker</h1>
      <main>
        <h1 className={(total >= 0 ? 'green' : 'red')}>${Math.floor(balance)}<span>.{cents}</span></h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={'+400 SAMSUNG TV'} />
            <input
              type="date"
              value={datetime}
              onChange={ev => setDatetime(ev.target.value)} />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              placeholder={'description'} />
          </div>
          <button type="submit" onClick={() => setChck(prev => prev + 1)}>Add new transaction</button>
        </form>
        <div>
          <div className="transactions">
            {transactions.length > 0 && transactions.map(transaction => (
              <div>
                <div className={"transaction " + (transaction.price < 0 ? 'red' : "green")}>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div className="price ">{(transaction.price < 0 ? '-' : "+")}${(transaction.price < 0 ? -1 : 1) * transaction.price}</div>
                    <div className="datetime">{transaction.datetime.substring(0, 10)}</div>
                  </div>
                  <button
                    className='TransactionButton'
                    onClick={() => setDelete(transaction._id)
                    }><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;
