$( document ).ready(function() {

  //animaciones normales de jquery
  $("#content-wrapper").hide();
  $("#content-wrapper").show("normal")
  
  //Cambios cuando se agrega un documento xml
  $(document).on('change', 'input[type=file]', function(e){

    //Busca la direccion temporal y la guarda en la variable
    var TmpPath = URL.createObjectURL(e.target.files[0]);
    //console.log(TmpPath);

    //Ajax la comunicacion con el documento y la extraccion del texto
    $.ajax({
      type: "GET",
      url: TmpPath,//direccion temporal del archivo
      dataType: "xml",//tipo de dato que se va a manipular
      success: function(xml){
        
        //Extrae los datos del xml pra filtrarlos
        xmlDoc = xml.documentElement.innerHTML;
        //console.log(xmlDoc);
        //funcion principal de filtro
        principal(xmlDoc);

    },
    error: function() {
      alert("Error en la direcion intentelo de nuevo.");
    }
    });  
  });

});

//funcion principal encargada de hacer el mapeo
function principal(xmlDoc){

  //Limpia lo campos para qu se utilizen otra vez
  $("#entrada").empty();
  $("#cuadros").empty();
  $("#salida").empty();

  //dividimos por renglon si es que hay mas
  divisor = xmlDoc.split("\n")
  //console.log(divisor);
  //Bucle del divisor aplica si hay mas renglones
  divisor.forEach(function(i) {
    //Para sacar el numero de serie
    ex=i;
    ex=ex.split('"');
    //console.log(ex)
    //Busca las siguientes cadenas de caracteres
    p=i.indexOf("<EjbTransaction")
    q=i.indexOf("/EjbTransaction>")

    //cortamos para reducir el codigo y solo el que vamos a ocupar
    addwords=i.slice(p,q);
    //conta potr las comillas simples
    addwords=addwords.split('"')
    //console.log(addwords)

    //saca el tamaño para el ciclo
    tamanio=addwords.length;

    for(a=0; a<=tamanio; a++){
      //Quitamos los espacios en blanco, por si llega a ver
      addwords[a]=$.trim(addwords[a]);

      //Condicional del nombre del system event
      if(addwords[a]=="<EjbTransaction systemevent="){

        var x = document.getElementById("entrada");
        var t = document.createTextNode(addwords[a+1] + "\n" + ex[1]);
        x.appendChild(t);
 

      }

      //Loos campos del system que se van a mapear
      if(addwords[a]=="><Fields><Field name=" || addwords[a]== "/><Field name="){
        //En el switch dependiendo de tipo de variable entra en la funcion
        switch (addwords[a+3]){
          case "String":
            salidastring(addwords[a+1]);
          break;
          case "Int":
            salidaint(addwords[a+1]);
          break;
          case "Double":
            salidadouble(addwords[a+1]);
          break;
          default:
            //alert("Hola :v error en la palabra: "+p[a]);
          break;
        }
      }
      //Declaracion de las listas y creacion de los textarea correspondientes por cada lista
      if(addwords[a]=="/></Fields><Tables><Table name="||addwords[a]=="/></Columns></Table><Table name=" || addwords[a]=="><Tables><Table name="){
        $("#cuadros").append('<h5>Resultado de las lista: '+ addwords[a+1] +' </h5> '+'<textarea class="form-control noresize" id="salida1'+ addwords[a+1] +'"  rows="10"></textarea>');
        liststring(addwords[a+1]);
        b=addwords[a+1];
        console.log[b]
      }
      //variables de las listas con estrada a la funcion de dos parametros la primera el nombre de la variable 
      //que se asigno a la lista, la segunda el nombre de la variable
      if(addwords[a]=="><Columns><Column name=" || addwords[a]=="/><Column name="){
        switch (addwords[a+3]){
          case "String":
            columnastring(addwords[a+1],b);
          break;
          case "Int":
            columnaint(addwords[a+1],b);
          break;
          case "Double":
            columnadouble(addwords[a+1],b);
          break;
          default:
            //alert("Hola :v error en la palabra: "+p[a]);
          break;
        }
      }
    }
  });
}

//Funciones para agregar textos en sus correspondientes textareas


//Los campos normales
function salidastring(variable){
  var x = document.getElementById("salida");
  var t = document.createTextNode("public string "+variable+" {get; set;} \n");
  x.appendChild(t);
}
function salidaint(variable){
  var x = document.getElementById("salida");
  var t = document.createTextNode("public int "+variable+" {get; set;} \n");
  x.appendChild(t);
}
function salidadouble(variable){
  var x = document.getElementById("salida");
  var t = document.createTextNode("public double "+variable+" {get; set;} \n");
  x.appendChild(t);
}

//Creacion de las listas
function liststring(variable){
  var x = document.getElementById("salida1"+variable);
  var t = document.createTextNode("public IList<" + variable + "> "+ variable+" {get; set;} \n");
  x.appendChild(t);
}

//funcion de las variables de las listas
function columnastring(variable, nombre){
  var x = document.getElementById("salida1"+nombre);
  var t = document.createTextNode("public string "+variable+" {get; set;} \n");
  x.appendChild(t);
}
function columnaint(variable, nombre){
  var x = document.getElementById("salida1"+nombre);
  var t = document.createTextNode("public int "+variable+" {get; set;} \n");
  x.appendChild(t);
}
function columnadouble(variable, nombre){
  var x = document.getElementById("salida1"+nombre);
  var t = document.createTextNode("public double "+variable+" {get; set;} \n");
  x.appendChild(t);
}