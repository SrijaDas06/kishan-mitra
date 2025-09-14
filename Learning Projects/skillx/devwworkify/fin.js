let transactions = [];

document.getElementById('transactionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const date = new Date();

  transactions.push({ desc, amount, type, date });
  updateSummary();
  drawChart();
  this.reset();
});

document.getElementById('interval').addEventListener('change', () => {
  updateSummary();
  drawChart();
});

function updateSummary() {
  const interval = parseInt(document.getElementById('interval').value);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - interval);

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.date >= cutoff) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
  });

  document.getElementById('totalIncome').innerText = income.toFixed(2);
  document.getElementById('totalExpense').innerText = expense.toFixed(2);
  document.getElementById('savings').innerText = (income - expense).toFixed(2);
  document.getElementById('loss').innerText = (expense > income ? (expense - income).toFixed(2) : '0.00');
}

function drawChart() {
  const interval = parseInt(document.getElementById('interval').value);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - interval);

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.date >= cutoff) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
  });

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(() => {
    const data = google.visualization.arrayToDataTable([
      ['Type', 'Amount'],
      ['Income', income],
      ['Expense', expense],
      ['Savings', income - expense]
    ]);

    const options = {
      title: 'Financial Summary',
      pieHole: 0.4,
      colors: ['#4caf50', '#f44336', '#2196f3']
    };

    const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  });
}
