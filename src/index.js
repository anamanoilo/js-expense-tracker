import { v4 as uuidv4 } from 'uuid';
import * as storage from './js/services/localStorage';


const transactionsToTest = [
  {
    id: '1',
    amount: 2500,
    text: 'Salary',
  },
  {
    id: '2',
    amount: -150,
    text: 'Donation',
  },
  {
    id: '3',
    amount: -15,
    text: 'Book',
  },
  {
    id: '4',
    amount: -3,
    text: 'Coffee',
  },
  {
    id: '5',
    amount: 100,
    text: 'Present',
  },
];

const refs = {
  totalBalance: document.querySelector('#balance'),
  income: document.querySelector('#money-plus'),
  expense: document.querySelector('#money-minus'),
  transactionList: document.querySelector('#list'),
  form: document.querySelector('#form'),
};


let transactions = storage.get('transactions') || [];

renderTransactionList(transactions);
updateTotals(transactions);
refs.transactionList.addEventListener('click', deleteTransaction);
refs.form.addEventListener('submit', addTransaction);

function renderTransactionList(transactions) {
  const markup = transactions
    .map(({ id, amount, text }) => createTransactionMarkup({ id, amount, text }))
    .join('');
  refs.transactionList.insertAdjacentHTML('afterbegin', markup);
}

function createTransactionMarkup({ id, amount, text }) {
  const amountClass = amount < 0 ? 'minus' : 'plus';
  return `<li
          class=${amountClass}
        >
          ${text} <span>${amount} </span
          ><button id=${id} class="delete-btn">x</button>
        </li>`;
}

function addTransaction(e) {
  e.preventDefault();
  const {
    elements: { text, amount },
  } = e.currentTarget;
  if (!text.value.trim() || !amount.value.trim()) {
    alert('All the fields must be filled');
    return;
  }
  if (amount.value.trim() === '0') {
    alert('Amount cannot be 0');
    return;
  }
  const transactionObj = {
    id: uuidv4(),
    [amount.name]: Number(amount.value).toFixed(2),
    [text.name]: text.value,
  };

  transactions.push(transactionObj);
  const transactionMarkup = createTransactionMarkup(transactionObj);
  refs.transactionList.insertAdjacentHTML('beforeend', transactionMarkup);
  updateTotals(transactions);
  storage.save('transactions', transactions);
  e.currentTarget.reset();
}


function deleteTransaction(e) {
  const id = e.target.id;
  transactions = transactions.filter(transaction => transaction.id !== id);
  refs.transactionList.innerHTML = '';
  renderTransactionList(transactions);
  updateTotals(transactions);
  storage.save('transactions', transactions);
}


//count and render balance, income, expense in 1 loop
function updateTotals(transactions) {
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    totalBalance += transaction.amount;
    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  }
  
  refs.totalBalance.textContent = `$${totalBalance}`;
  refs.income.textContent = `$${totalIncome}`;
  refs.expense.textContent = `$${-totalExpense}`;
}




