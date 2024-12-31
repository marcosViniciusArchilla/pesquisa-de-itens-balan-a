let items = [];
const newSearchButton = document.getElementById('newSearchButton');
const searchButton = document.getElementById('searchButton');

        // Valida a estrutura do arquivo Excel
        function validateExcel(data) {
            const requiredHeaders = ['Código', 'Descrição', 'Preço'];
            const headers = Object.keys(data[0] || {});
            return requiredHeaders.every(header => headers.includes(header));
        }

         // Carrega o arquivo Excel
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Converte a planilha para JSON
            items = XLSX.utils.sheet_to_json(firstSheet);
            
                if (validateExcel(items)) {
                    alert('Arquivo carregado com sucesso!');
                    // Salva os dados no localStorage
                    localStorage.setItem('excelData', JSON.stringify(items));
                } else {
                    alert('O arquivo não contém os cabeçalhos necessários: Código, Descrição, Preço.');
                    items = [];
                    }
                };
            
                reader.readAsArrayBuffer(file);
            });
            
            // Carrega os dados do localStorage ao iniciar
            window.addEventListener('load', function() {
                const storedData = localStorage.getItem('excelData');
                if (storedData) {
                    items = JSON.parse(storedData);
                }
            });
            
            // Realiza a pesquisa
            document.getElementById('searchButton').addEventListener('click', function() {
                if (items.length === 0) {
                    alert('Por favor, carregue um arquivo válido antes de realizar a pesquisa.');
                    return;
                }
            
                const query = document.getElementById('searchInput').value.toLowerCase();
                let results;
            
                if (!isNaN(query)) { // Verifica se a pesquisa é numérica (código)
                    results = items.filter(item => item.Código && item.Código.toString().toLowerCase() === query);
                } else { // Caso contrário, pesquisa por descrição
                    results = items.filter(item => item.Descrição && item.Descrição.toLowerCase().includes(query));
                }
            
                const resultElement = document.getElementById('result');
            
                if (results.length > 0) {
                    resultElement.innerHTML = results.slice(0, 50).map(result => 
                        `<p>Código: ${result.Código || 'N/A'}, Descrição: ${result.Descrição || 'N/A'}, Preço: ${result.Preço || 'N/A'}</p>`
                    ).join('');
            
                    if (results.length > 50) {
                        resultElement.innerHTML += `<p>...e mais ${results.length - 50} itens encontrados.</p>`;
                    }
                } else {
                    resultElement.textContent = 'Nenhum item encontrado.';
                }
            
                // Mostrar o botão "Nova Pesquisa"
                document.getElementById('newSearchButton').style.display = 'block';
            });
            
            // Adicionar evento de clique para o botão "Nova Pesquisa"
            document.getElementById('newSearchButton').addEventListener('click', function() {
                document.getElementById('searchInput').value = '';
                document.getElementById('result').innerHTML = '';
                this.style.display = 'none';
            });
      
;