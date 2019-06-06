const name = document.querySelector('[id="name"]');
const companyName = document.querySelector('[id="company"]');
const percentage = document.querySelector('[id="percentage"]');
const button = document.querySelector('.send-button');
const blockItens = document.querySelector('.block-itens');
const blockCharts = document.querySelector('[id="wrapContainer"]');

const myHeaders = new Headers();

const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors'
};

const dataLists = [];

function getDataApi() {
  fetch('http://localhost:3000/get', myInit).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Erro na resposta do servidor');
      }
    })
    .then(json => {
      json.forEach(obj => {
        item(obj.label, obj.company, obj.y);
      })
      return json;
    });
}

getDataApi();

function postDataApi(param) {
  fetch('http://localhost:3000/post', {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      body: JSON.stringify(param),
      contentType: "application/json; charset=utf-8"
    }).then(res => res.json())
    .then((res) => {
      if (res.label === "Erro") {
        alert('Ocorreu um erro no seu pedido, por favor tentar novamente')
      } else {
        item(res.label, res.company, res.y);
      }
    });
}


function createChart(dataPoints) {

  const id = "chartContainer";
  const chart = new CanvasJS.Chart(id, {
    theme: "light2",
    title: {
      text: 'Agrupamento'
    },
    data: [{
      type: "pie",
      showInLegend: true,
      legendText: "{indexLabel}",
      toolTipContent: "{company} - R${y} - #percent %",
      dataPoints: dataPoints
    }]
  });

  chart.render();
}

function item(templateName, templateCompany, templatePercentage) {

  const object = {
    label: templateName,
    company: templateCompany,
    y: templatePercentage
  }

  const item =
    `<p class="item-name"> ${object.label} </p>
   <span class="item-company">${object.company}</span>
   <p class="item-percentage"> R$${object.y} </p>`;

  const domItem = document.createElement('div');
  domItem.classList.add('item');
  domItem.innerHTML = item;

  dataLists.push({
    y: +(object.y),
    label: object.label,
    company: object.company
  });

  blockItens.append(domItem);
  createChart(dataLists, templateCompany);


}


button.addEventListener('click', () => {
  if (name.value !== '' && companyName.value !== '' && percentage.value !== '') {
    const data = {
      label: name.value,
      company: companyName.value,
      y: percentage.value
    }

    const stringData = JSON.stringify(data);
    postDataApi(data);
    name.value = '';
    companyName.value = '';
    percentage.value = '';
  } else {
    alert('Preencha tudo');
  }
});