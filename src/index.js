import * as storage from './js/services/localStorage';

const refs = {
  totalBalance: document.querySelector('#balance'),
  income: document.querySelector('#money-plus'),
  expense: document.querySelector('#money-minus'),
  transactionList: document.querySelector('#list'),
  textInput: document.querySelector('input#text'),
  amountInput: document.querySelector('input#amount'),
  addTransactionBtn: document.querySelector('.btn'),
  form: document.querySelector('#form'),
};

const transactionsToTest = [
  {
    id: 1,
    amount: 2500,
    text: 'Salary',
  },
  {
    id: 2,
    amount: -250,
    text: 'Donation',
  },
  {
    id: 3,
    amount: -15,
    text: 'Book',
  },
  {
    id: 4,
    amount: -3,
    text: 'Coffee',
  },
  {
    id: 5,
    amount: 100,
    text: 'Present',
  },
];

const transactions = transactionsToTest;

function renderTransactionList(transactions){ 
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
  const transactionObj = {
    id: Date.now().toString(),
    [text.name]: text.value,
    [amount.name]: Number(amount.value),
  };
  console.log('typeof transactionObj.amount.value:', typeof transactionObj.amount.value);

  console.log(transactionObj);
  transactions.push(transactionObj);
  storage.save('transactions', transactions);
  const transactionMarkup = createTransactionMarkup(transactionObj);
  refs.transactionList.insertAdjacentHTML('beforeend', transactionMarkup);
  e.currentTarget.reset();
}
refs.form.addEventListener('submit', addTransaction);

function deleteTransactionById(e) {
  const id = Number(e.target.id);
  const filteredTransactions = transactions.filter(transaction => transaction.id !== id);
  refs.transactionList.innerHTML = "";
  renderTransactionList(filteredTransactions);
  storage.save('transactions', filteredTransactions);
}



const total = transactions.reduce((acc, {amount})=>acc+=amount, 0)
refs.totalBalance.textContent = `$${total}`;

let income = 0;
let expense = 0;

transactions.forEach(({ amount }) => {
  return amount > 0 ? (income += amount) : expense+=amount
})


refs.income.textContent = `$${income}`;
refs.expense.textContent = `$${-expense}`;
renderTransactionList(transactions)
  refs.deleteButton = document.querySelector('.delete-btn');
  refs.deleteButton.addEventListener('click',  deleteTransactionById)


