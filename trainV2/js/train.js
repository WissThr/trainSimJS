/************************************************************/
/**
 * Université Sorbonne Paris Nord, Programmation Web
 * Auteurs                       : Étienne André
 * Création                      : 2023/12/11
 * Dernière modification         : 2024/04/25
 */
/************************************************************/

"use strict";

/************************************************************/
/* Constantes */
/************************************************************/
const D = "droite";
const G = "gauche";
const H = "haut";
const B = "bas";
/*------------------------------------------------------------*/
// Dimensions du plateau
/*------------------------------------------------------------*/

// Nombre de cases par défaut du simulateur
const LARGEUR_PLATEAU = 30;
const HAUTEUR_PLATEAU = 15;

// Dimensions des cases par défaut en pixels
const LARGEUR_CASE = 35;
const HAUTEUR_CASE = 40;

/*------------------------------------------------------------*/
// Types des cases
/*------------------------------------------------------------*/
class Type_de_case {
  static Foret = new Type_de_case("foret",0);

  static Eau = new Type_de_case("eau",0);

  static Rail_horizontal = new Type_de_case("rail horizontal",0);

  static Rail_vertical = new Type_de_case("rail vertical",0);

  // NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le haut (ou de vertical vers horizontal en allant de bas vers gauche)
  static Rail_droite_vers_haut = new Type_de_case("rail droite vers haut",0);

  // NOTE: faisant la jonction de vertical à horizontal en allant vers le haut puis vers la droite (ou de horizontal à vertical en allant de gauche vers le bas)
  static Rail_haut_vers_droite = new Type_de_case("rail haut vers droite",0);

  // NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le bas (ou de vertical vers horizontal en allant de haut vers gauche)
  static Rail_droite_vers_bas = new Type_de_case("rail droite vers bas",0);

  // NOTE: faisant la jonction de vertical à horizontal en allant vers le bas puis vers la droite (ou de horizontal à vertical en allant de gauche vers le haut)
  static Rail_bas_vers_droite = new Type_de_case("rail bas vers droite",0);

  constructor(nom,d) {
    this.nom = nom;
    this.debris=d;
  }
}


/*------------------------------------------------------------*/
// Images
/*------------------------------------------------------------*/
const IMAGE_EAU = new Image();
IMAGE_EAU.src = "images/eau.png";

const IMAGE_FORET = new Image();
IMAGE_FORET.src = "images/foret.png";

const IMAGE_LOCO = new Image();
IMAGE_LOCO.src = "images/locomotive.png";

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = "images/rail-horizontal.png";

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = "images/rail-vertical.png";

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = "images/rail-bas-vers-droite.png";

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = "images/rail-droite-vers-bas.png";

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = "images/rail-droite-vers-haut.png";

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = "images/rail-haut-vers-droite.png";

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = "images/wagon.png";

const IMAGE_DEBRIS = new Image();
IMAGE_DEBRIS.src = "images/debris.png"

/************************************************************/
// Variables globales
/************************************************************/

// TODO
let b;
let t = null;
let sncf = [];
let debris=[];
let timerId;
let pause=false;

/************************************************************/
/* Classes */
/************************************************************/
class Trains {
  constructor(a, b, taille) {
    this.x = a;
    this.y = b;
    this.wagon = [];
    for (let p = 1; p < taille; ++p) {
      this.wagon.push(new Trains(this.x - p, this.y, 1));
    }
    this.direction = D;
  }
}
/*------------------------------------------------------------*/
// Plateau
/*------------------------------------------------------------*/

class Plateau {
  /* Constructeur d'un plateau vierge */
  constructor() {
    this.largeur = LARGEUR_PLATEAU;
    this.hauteur = HAUTEUR_PLATEAU;

    // NOTE: à compléter…

    // État des cases du plateau
    // NOTE: tableau de colonnes, chaque colonne étant elle-même un tableau de cases (beaucoup plus simple à gérer avec la syntaxe case[x][y] pour une coordonnée (x,y))
    this.cases = [];
    for (let x = 0; x < this.largeur; x++) {
      this.cases[x] = [];
      for (let y = 0; y < this.hauteur; y++) {
        this.cases[x][y] = Type_de_case.Foret;
      }
    }
  }

  // NOTE: à compléter…
}

// TODO : d'autres classes si besoin

/************************************************************/
// Méthodes
/************************************************************/

function image_of_case(type_de_case) {
  switch (type_de_case.nom) {
    case "foret":
      return IMAGE_FORET;
    case "eau":
      return IMAGE_EAU;
    case "rail horizontal":
      return IMAGE_RAIL_HORIZONTAL;
    case "rail vertical":
      return IMAGE_RAIL_VERTICAL;
    case "rail droite vers haut":
      return IMAGE_RAIL_DROITE_VERS_HAUT;
    case "rail haut vers droite":
      return IMAGE_RAIL_HAUT_VERS_DROITE;
    case "rail droite vers bas":
      return IMAGE_RAIL_DROITE_VERS_BAS;
    case "rail bas vers droite":
      return IMAGE_RAIL_BAS_VERS_DROITE;
   /* case Type_de_case.debris:
      return IMAGE_DEBRIS;*/
  }
}

function tdc(i) {
  switch (i.id) {
    case "bouton_foret":
      return Type_de_case.Foret;

    case "bouton_eau":
      return Type_de_case.Eau;

    case "bouton_rail_horizontal":
      return Type_de_case.Rail_horizontal;

    case "bouton_rail_vertical":
      return Type_de_case.Rail_vertical;

    case "bouton_rail_droite_vers_haut":
      return Type_de_case.Rail_droite_vers_haut;

    case "bouton_rail_haut_vers_droite":
      return Type_de_case.Rail_haut_vers_droite;

    case "bouton_rail_droite_vers_bas":
      return Type_de_case.Rail_droite_vers_bas;

    case "bouton_rail_bas_vers_droite":
      return Type_de_case.Rail_bas_vers_droite;

    case "bouton_train_1":
      return "train1";

    case "bouton_train_2":
      return "train2";

    case "bouton_train_4":
      return "train4";

    case "bouton_train_6":
      return "train6";
  }
}

function dessine_case(contexte, plateau, x, y) {
  const la_case = plateau.cases[x][y];

  // NOTE: à améliorer

  let image_a_afficher = image_of_case(la_case);
  // Affiche l'image concernée
  contexte.drawImage(
    image_a_afficher,
    x * LARGEUR_CASE,
    y * HAUTEUR_CASE,
    LARGEUR_CASE,
    HAUTEUR_CASE
  );
}

function dessine_plateau(page, plateau) {
  // Dessin du plateau avec paysages et rails
  for (let x = 0; x < plateau.largeur; x++) {
    for (let y = 0; y < plateau.hauteur; y++) {
      dessine_case(page, plateau, x, y);
    }
  }

  // NOTE: à compléter…
}

// TODO : d'autres méthodes si besoin

function creerTrain(x, y, taille) {
  sncf.push(new Trains(x, y, taille));
}

function wagonPb(plateau, n, x, y) {
  let a = 0;
  for (let i = 0; i < n; ++i) {
    if (plateau.cases[x - i][y].nom.includes("rail")&&plateau.cases[x - i][y].debris!=1) {
      ++a;
    }
  }
  console.log(a);
  return a === n;
}

function dessineTrain(contexte, plateau) {
  sncf.forEach((train) => {
    contexte.drawImage(
      IMAGE_LOCO,
      train.x * LARGEUR_CASE,
      train.y * HAUTEUR_CASE,
      LARGEUR_CASE,
      HAUTEUR_CASE
    );
    train.wagon.forEach((w) => {
      contexte.drawImage(
        IMAGE_WAGON,
        w.x * LARGEUR_CASE,
        w.y * HAUTEUR_CASE,
        LARGEUR_CASE,
        HAUTEUR_CASE
      );
    });
  });
}

function dessineDebris(contexte, plateau) {
  debris.forEach((train) => {
    contexte.drawImage(
      IMAGE_DEBRIS,
      train.x * LARGEUR_CASE,
      train.y * HAUTEUR_CASE,
      LARGEUR_CASE,
      HAUTEUR_CASE
    );
    train.wagon.forEach((w) => {
      contexte.drawImage(
        IMAGE_DEBRIS,
        w.x * LARGEUR_CASE,
        w.y * HAUTEUR_CASE,
        LARGEUR_CASE,
        HAUTEUR_CASE
      );
    });
  });
}

function avancer(contexte, plateau) {
  let dehors = [];

  sncf.forEach((train) => {
    // Déplace les wagons
    for (let i = train.wagon.length - 1; i > 0; i--) {
      train.wagon[i].x = train.wagon[i - 1].x;
      train.wagon[i].y = train.wagon[i - 1].y;
    }
    if (train.wagon.length > 0) {
      train.wagon[0].x = train.x;
      train.wagon[0].y = train.y;
    }

    // Déplace la locomotive
    if (train.direction === D) {
      train.x += 1;
    }
    if (train.direction === G) {
      train.x -= 1;
    }
    if (train.direction === H) {
      train.y -= 1;
    }
    if (train.direction === B) {
      train.y += 1;
    }

    // Vérifie si la locomotive est encore sur un rail
    if (
      train.x >= plateau.length ||
      !plateau.cases[train.x] ||
      !plateau.cases[train.x][train.y]
    ) {
      dehors.push(train);
    } else if (!plateau.cases[train.x][train.y].nom.includes("rail")) {
      dehors.push(train);
      plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
      train.wagon.forEach((w) => {
        plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
      });
    } else if (plateau.cases[train.x][train.y].debris === 1) {
      dehors.push(train);
      plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
      train.wagon.forEach((w) => {
        plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
      });
    } else if (plateau.cases[train.x][train.y].nom.includes("vers bas")) {
      if (train.direction === H) {
        train.direction = G;
      } else if (train.direction === D) {
        train.direction = B;
      } else {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    } else if (plateau.cases[train.x][train.y].nom.includes("vers haut")) {
      if (train.direction === D) {
        train.direction = H;
      } else if (train.direction === B) {
        train.direction = G;
      } else {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    } else if (plateau.cases[train.x][train.y].nom.includes("rail haut vers droite")) {
      if (train.direction === H) {
        train.direction = D;
      } else if (train.direction === G) {
        train.direction = B;
      } else {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    } else if (plateau.cases[train.x][train.y].nom.includes("vertical")) {
      if (train.direction === D || train.direction === G) {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    } else if (plateau.cases[train.x][train.y].nom.includes("horizontal")) {
      if (train.direction === H || train.direction === B) {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    } else if (plateau.cases[train.x][train.y].nom.includes("rail bas vers droite")) {
      if (train.direction === B) {
        train.direction = D;
      } else if (train.direction === G) {
        train.direction = H;
      } else {
        dehors.push(train);
        plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 1);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 1);
        });
      }
    }
  });

  // Supprime les trains qui ne sont plus sur les rails
  dehors.forEach((train) => {
    debris.push(train);
    sncf.splice(sncf.indexOf(train), 1);
  });

  // Dessine le plateau une seule fois après tous les déplacements
  dessine_plateau(contexte, plateau);

  // Dessine tous les trains à leurs nouvelles positions
  dessineTrain(contexte, plateau);
  dessineDebris(contexte, plateau);

  // Planifie le prochain appel à avancer après 500 millisecondes
  clearTimeout(timerId);
  if (pause == false) {
    timerId = setTimeout(avancer, 500, contexte, plateau);
  }
}


function clearDebris(contexte,plateau){
	debris.forEach((train)=>{
		plateau.cases[train.x][train.y] = new Type_de_case(plateau.cases[train.x][train.y].nom, 0);
        train.wagon.forEach((w) => {
          plateau.cases[w.x][w.y] = new Type_de_case(plateau.cases[w.x][w.y].nom, 0);
        });
	});
	debris.length=0;
}

/************************************************************/
// Auditeurs
/************************************************************/

// TODO

/************************************************************/
// Plateau de jeu initial
/************************************************************/

// NOTE : ne pas modifier le plateau initial
function cree_plateau_initial(plateau) {
  // Circuit
  plateau.cases[12][7] = Type_de_case.Rail_horizontal;
  plateau.cases[13][7] = Type_de_case.Rail_horizontal;
  plateau.cases[14][7] = Type_de_case.Rail_horizontal;
  plateau.cases[15][7] = Type_de_case.Rail_horizontal;
  plateau.cases[16][7] = Type_de_case.Rail_horizontal;
  plateau.cases[17][7] = Type_de_case.Rail_horizontal;
  plateau.cases[18][7] = Type_de_case.Rail_horizontal;
  plateau.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
  plateau.cases[19][6] = Type_de_case.Rail_vertical;
  plateau.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
  plateau.cases[12][5] = Type_de_case.Rail_horizontal;
  plateau.cases[13][5] = Type_de_case.Rail_horizontal;
  plateau.cases[14][5] = Type_de_case.Rail_horizontal;
  plateau.cases[15][5] = Type_de_case.Rail_horizontal;
  plateau.cases[16][5] = Type_de_case.Rail_horizontal;
  plateau.cases[17][5] = Type_de_case.Rail_horizontal;
  plateau.cases[18][5] = Type_de_case.Rail_horizontal;
  plateau.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
  plateau.cases[11][6] = Type_de_case.Rail_vertical;
  plateau.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

  // Segment isolé à gauche
  plateau.cases[0][7] = Type_de_case.Rail_horizontal;
  plateau.cases[1][7] = Type_de_case.Rail_horizontal;
  plateau.cases[2][7] = Type_de_case.Rail_horizontal;
  plateau.cases[3][7] = Type_de_case.Rail_horizontal;
  plateau.cases[4][7] = Type_de_case.Rail_horizontal;
  plateau.cases[5][7] = Type_de_case.Eau;
  plateau.cases[6][7] = Type_de_case.Rail_horizontal;
  plateau.cases[7][7] = Type_de_case.Rail_horizontal;

  // Plan d'eau
  for (let x = 22; x <= 27; x++) {
    for (let y = 2; y <= 5; y++) {
      plateau.cases[x][y] = Type_de_case.Eau;
    }
  }

  // Segment isolé à droite
  plateau.cases[22][8] = Type_de_case.Rail_horizontal;
  plateau.cases[23][8] = Type_de_case.Rail_horizontal;
  plateau.cases[24][8] = Type_de_case.Rail_horizontal;
  plateau.cases[25][8] = Type_de_case.Rail_horizontal;
  plateau.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
  plateau.cases[27][8] = Type_de_case.Rail_horizontal;
  plateau.cases[28][8] = Type_de_case.Rail_horizontal;
  plateau.cases[29][8] = Type_de_case.Rail_horizontal;

  // TCHOU
  plateau.cases[3][10] = Type_de_case.Eau;
  plateau.cases[4][10] = Type_de_case.Eau;
  plateau.cases[4][11] = Type_de_case.Eau;
  plateau.cases[4][12] = Type_de_case.Eau;
  plateau.cases[4][13] = Type_de_case.Eau;
  plateau.cases[4][13] = Type_de_case.Eau;
  plateau.cases[5][10] = Type_de_case.Eau;

  plateau.cases[7][10] = Type_de_case.Eau;
  plateau.cases[7][11] = Type_de_case.Eau;
  plateau.cases[7][12] = Type_de_case.Eau;
  plateau.cases[7][13] = Type_de_case.Eau;
  plateau.cases[8][10] = Type_de_case.Eau;
  plateau.cases[9][10] = Type_de_case.Eau;
  plateau.cases[8][13] = Type_de_case.Eau;
  plateau.cases[9][13] = Type_de_case.Eau;

  plateau.cases[11][10] = Type_de_case.Eau;
  plateau.cases[11][11] = Type_de_case.Eau;
  plateau.cases[11][12] = Type_de_case.Eau;
  plateau.cases[11][13] = Type_de_case.Eau;
  plateau.cases[12][11] = Type_de_case.Eau;
  plateau.cases[13][10] = Type_de_case.Eau;
  plateau.cases[13][11] = Type_de_case.Eau;
  plateau.cases[13][12] = Type_de_case.Eau;
  plateau.cases[13][13] = Type_de_case.Eau;

  plateau.cases[15][10] = Type_de_case.Eau;
  plateau.cases[15][11] = Type_de_case.Eau;
  plateau.cases[15][12] = Type_de_case.Eau;
  plateau.cases[15][13] = Type_de_case.Eau;
  plateau.cases[16][10] = Type_de_case.Eau;
  plateau.cases[16][13] = Type_de_case.Eau;
  plateau.cases[17][10] = Type_de_case.Eau;
  plateau.cases[17][11] = Type_de_case.Eau;
  plateau.cases[17][12] = Type_de_case.Eau;
  plateau.cases[17][13] = Type_de_case.Eau;

  plateau.cases[19][10] = Type_de_case.Eau;
  plateau.cases[19][11] = Type_de_case.Eau;
  plateau.cases[19][12] = Type_de_case.Eau;
  plateau.cases[19][13] = Type_de_case.Eau;
  plateau.cases[20][13] = Type_de_case.Eau;
  plateau.cases[21][10] = Type_de_case.Eau;
  plateau.cases[21][11] = Type_de_case.Eau;
  plateau.cases[21][12] = Type_de_case.Eau;
  plateau.cases[21][13] = Type_de_case.Eau;
}

/************************************************************/
// Fonction principale
/************************************************************/

function tchou() {
  console.log("Tchou, attention au départ !");
  /*------------------------------------------------------------*/
  // Variables DOM
  /*------------------------------------------------------------*/
  let canvas = document.getElementById("simulateur");
  const contexte = document.getElementById("simulateur").getContext("2d");
  const d = document.getElementById("boutons");
  const ba = d.querySelectorAll("input[type=image]");
  //const rect = canvas.getBoundingClientRect();
  // NOTE: ce qui suit est sûrement à compléter voire à réécrire intégralement

  // Création du plateau
  let plateau = new Plateau();
  cree_plateau_initial(plateau);

  // Dessine le plateau
  dessine_plateau(contexte, plateau);
  let prec = null;

  ba.forEach((i) => {
    i.addEventListener("click", () => {
      i.disabled = true;
      if (prec != null) prec.disabled = false;
      prec = i;
      t = tdc(prec);
      console.log(t);
    });
  });
  
  	
  	timerId= setTimeout(avancer, 500, contexte, plateau);
  	let bp  = document.getElementById("bouton_pause");
  	bp.addEventListener("click",(e)=>{
  		if(bp.innerText=="Pause"){
  			bp.innerText="Redémarrer";
  			pause=true;
  			timerId=null;
  		}else{
  			bp.innerText="Pause";
  			pause=false;
  			timerId= setTimeout(avancer, 500, contexte, plateau);
  		}
  	});
  	  	
	let bc  = document.getElementById("bouton_clear");
	bc.addEventListener("click",(e)=>{
		clearDebris(contexte,plateau);
	});


	
  canvas.addEventListener("click", (e) => {
    if (t != null) {
      console.log(t);
      let x = Math.floor(e.offsetX / LARGEUR_CASE);
      let y = Math.floor(e.offsetY / HAUTEUR_CASE);
      //console.log("x="+x+" et y="+y);
      if (!(typeof t === "string")) {
        plateau.cases[x][y] = t;
        dessine_case(contexte, plateau, x, y);
      } else {
        if (t.includes("1") && wagonPb(plateau, 1, x, y)) {
          creerTrain(x, y, 1);
        }
        if (t.includes("2") && wagonPb(plateau, 2, x, y)) {
          creerTrain(x, y, 2);
        } else if (t.includes("4") && wagonPb(plateau, 4, x, y)) {
          creerTrain(x, y, 4);
        } else if (t.includes("6") && wagonPb(plateau, 6, x, y)) {
          creerTrain(x, y, 6);
        }
        dessineTrain(contexte, plateau);
      }
    }
  });
}

/************************************************************/
// Programme principal
/************************************************************/
// NOTE: rien à modifier ici !
window.addEventListener("load", () => {
  // Appel à la fonction principale
  tchou();
});
