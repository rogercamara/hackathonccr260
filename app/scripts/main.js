// Verifica se o usuário está logado

firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
    //   Logado
        let user = firebase.auth().currentUser;
        let uid
        if(user != null){
            uid = user.uid;
        }
        let firebaseRefKey = firebase.database().ref().child(uid);
        firebaseRefKey.once('value', (dataSnapShot)=>{
            $('.show-user-name').html(dataSnapShot.val().userFullName)
            document.getElementById('login-btn').style.display = 'none';
            $('.bemvindohero').css('display','none')

        })
    } else {
        // Não logado
      document.getElementById('usuario-login-pass-error').style.display = 'block';
        $('.user-achievements').css('display','none');
        $('.bemvindo').css('display','none');
        $('.recomendacoes').css('display','none')
    }
  });

//   Validação de campos
function verificaNomeCompleto(){
  var sobrenome = document.getElementById('form-nome-completo').value;
  var flag = false;
  if(sobrenome === ''){
      flag = true;
  }
  if(flag){
      document.getElementById('nome-completo-error').style.display = 'block';
  }else{
      document.getElementById('nome-completo-error').style.display = 'none';
  }
}

function verificaLoginMail(){
  var usuarioMail = document.getElementById('usuario-login-mail');
  var usuarioMailFormato = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var flag;
  if(usuarioMail.value.match(usuarioMailFormato)){
      flag = false;
  }else{
      flag = true;
  }
  if(flag){
      document.getElementById('usuario-login-mail-error').style.display = 'block';
  }else{
      document.getElementById('usuario-login-mail-error').style.display = 'none';
  }
}

function verificaLoginPass(){
  var usuarioPass = document.getElementById('usuario-login-pass');
  var usuarioPassFormato = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;      
  var flag;
  if(usuarioPass.value.match(usuarioPassFormato)){
      flag = false;
  }else{
      flag = true;
  }    
  if(flag){
      document.getElementById('usuario-login-pass-error').style.display = 'block';
  }else{
      document.getElementById('usuario-login-pass-error').style.display = 'none';
  }
}

// Login


function novoCurso(titulo,categoria,texto,imagem,autor,empresa){
    var cursoData = {
        cursoTitulo: titulo,
        cursoCategoria: categoria,
        cursoTexto: texto,
        cursoImagem: imagem,
        cursoAutor: autor,
        cursoEmpresa: empresa,
    }
    var dbCursos = firebase.database().ref('cursos/artigo');
    dbCursos.push(cursoData);
}
var listaCursos = firebase.database().ref('cursos/artigo').orderByKey();

listaCursos.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

        var key = childSnapshot.key;
        var childData = childSnapshot.val();

        var  cardContainer = document.getElementById('cardContainer');

        var  categoria = document.getElementById('categoria01');

            var item = document.createElement('div');
            item.className = 'col cat-item-card';
        
            var card = document.createElement('div');
            card.className = 'card';
        
            var cardImagem = document.createElement('img');
            cardImagem.className = 'card-img-top cat-item-image';
            cardImagem.src = 'images/'+childData.cursoImagem;
        
            var cardBody = document.createElement('div');
            cardBody.className = 'card-body';
        
            var cardTitulo = document.createElement('h6');
            cardTitulo.innerText = childData.cursoTitulo;
            cardTitulo.className = 'card-title cat-item-titulo';
            
            var cardCategoria = document.createElement('p');
            cardCategoria.className = 'card-text';
        
            var cardCategoriaText = document.createElement('span');
            cardCategoriaText.innerText = childData.cursoCategoria;
            cardCategoriaText.className = 'badge bg-light text-dark cat-item-tag';
        
            item.appendChild(card);
            card.appendChild(cardImagem)
            card.appendChild(cardBody)
            cardBody.appendChild(cardTitulo)
            cardBody.appendChild(cardCategoria)
            cardCategoria.appendChild(cardCategoriaText)
            cardContainer.appendChild(item);
            // categoria.appendChild(item);

    });
  }, function(error) {
    console.error(error);
  });

  listaCursos.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

        var key = childSnapshot.key;
        var childData = childSnapshot.val();

        var  categoria = document.getElementById('categoria01');

            var item = document.createElement('div');
            item.className = 'col cat-item-card';
        
            var card = document.createElement('div');
            card.className = 'card';
        
            var cardImagem = document.createElement('img');
            cardImagem.className = 'card-img-top cat-item-image';
            cardImagem.src = 'images/'+childData.cursoImagem;
        
            var cardBody = document.createElement('div');
            cardBody.className = 'card-body';
        
            var cardTitulo = document.createElement('h6');
            cardTitulo.innerText = childData.cursoTitulo;
            cardTitulo.className = 'card-title cat-item-titulo';
            
            var cardCategoria = document.createElement('p');
            cardCategoria.className = 'card-text';
        
            var cardCategoriaText = document.createElement('span');
            cardCategoriaText.innerText = childData.cursoCategoria;
            cardCategoriaText.className = 'badge bg-light text-dark cat-item-tag';
        
            item.appendChild(card);
            card.appendChild(cardImagem)
            card.appendChild(cardBody)
            cardBody.appendChild(cardTitulo)
            cardBody.appendChild(cardCategoria)
            categoria.appendChild(item);

    });
  }, function(error) {
    console.error(error);
  });




function signIn(){

    var usuarioMail = document.getElementById('usuario-login-mail').value;
    var usuarioPass = document.getElementById('usuario-login-pass').value;
    var usuarioMailFormato = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var usuarioPassFormato = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;      
  
    var userMail = usuarioMail.match(usuarioMailFormato);
    var userPass = usuarioPass.match(usuarioPassFormato);
  
    if(userMail == null){
        return verificaLoginMail();
    }else if(userPass == null){
        return verificaLoginPass();
    }else{
        firebase.auth().signInWithEmailAndPassword(usuarioMail, usuarioPass).then((success) => {
            console.log('Usuário logado')
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
    }
  }
