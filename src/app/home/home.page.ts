import { MenuController, NavParams, ModalController } from '@ionic/angular';
import { NavController,ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { serverUrl } from './../../environments/environment';
import { HTTP, HTTPResponse} from '@ionic-native/http/ngx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { resolve } from 'url';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    private menu: MenuController,
    public navCtrl: NavController, 
    private toast: ToastController,
    public http: HttpClient) { }

    requestOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json,charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Response-Type': 'text/html'
      })
    }
  
  private cartao: string;

  //---------------------------------------------------------------------------
  // Obter informações do cartão suspeito de fraude
  //---------------------------------------------------------------------------
  obterInformacoesCardbin() {
    console.log('>>>>> Entrou no obterInformacoesCardbin');
    console.log(this.cartao);
    let url = serverUrl + 'retrieve_transaction_by_cardbin/'+ this.cartao;
    console.log(url);
    return new Promise((resolve, reject) => {
      this.http.get(url, this.requestOptions).subscribe((result: any) => {
        console.log('>>>>> Deu certo');
        console.log(JSON.parse(JSON.stringify(result)));
        resolve(JSON.parse(JSON.stringify(result)));
        },
        (error) => {
          console.log('>>>>> Deu erro');
          console.log(JSON.parse(JSON.stringify(error)));
          reject(JSON.parse(JSON.stringify(error)));
        });
    });
  }

  //---------------------------------------------------------------------------
  // Verifica se o cartão existe na base de suspeito
  //---------------------------------------------------------------------------
  verificarSeCardbinExiste() {
    console.log('*>>>>> Entrou no verificarSeCardbinExiste');
    console.log(this.cartao);
    let url = serverUrl + 'verify_cardbin_exists/' + this.cartao;
    console.log(url);
    return new Promise((resolve, reject) => {
      this.http.get(url, this.requestOptions).subscribe((result: any) => {
        console.log('>>>>> Deu certo');
          console.log(JSON.parse(JSON.stringify(result)));
          resolve(JSON.parse(JSON.stringify(result)));
        },
        (error) => {
          console.log('>>>>> Deu erro');
          console.log(JSON.parse(JSON.stringify(error)));
          reject(JSON.parse(JSON.stringify(error)));
        });
      });
  }


  //---------------------------------------------------------------------------
  // Retorna verdadeiro se o cartão é suspeito de fraude (blacklist)
  //---------------------------------------------------------------------------
  verificarCardbinSuspeito() {
    console.log('>>>>> Entrou no verificarCardbinSuspeito');
    console.log(this.cartao);
    if (this.cartao == undefined)
    {
      this.presentToastCartao('Informe o número do cartão', 'warning');
      return;
    }
    let url = serverUrl + 'retrieve_cardbin_suspeito/'+ this.cartao;
    console.log(url);
    console.log(this.requestOptions);
    return new Promise((resolve, reject) => {
      this.http.get(url, this.requestOptions).subscribe((result: any) => {
        console.log('>>>>> Deu certo');
        console.log(JSON.parse(JSON.stringify(result)));
        resolve(JSON.parse(JSON.stringify(result)));
        let retorno = JSON.parse(JSON.stringify(result));
        console.log(retorno);
        if (retorno == true){
          this.presentToastCartao('Cartão suspeito. Transação não será permitida', 'danger');
        }
        if (retorno == null){
          this.presentToastCartao('Cartão válido. Transação será permitida', 'success');
        }
      },
        (error) => {
          console.log('>>>>> Deu erro');
          console.log(JSON.parse(JSON.stringify(error)));
          reject(JSON.parse(JSON.stringify(error)));
        });
    });
  }

  //----------------------------------------------
  // Exibe mensagem para validação do cartão 
  //----------------------------------------------
  async presentToastCartao(texto: string, cor: string) {
    const toast = await this.toast.create({
      message: texto,
      animated: true,
      position: 'bottom',
      color: cor,
      duration: 2000,
//      buttons: [
//         {
//          text: 'Ok',
//          role: 'cancel',
//          handler: () => {
//            console.log('Cancel clicked');
//          }
//        }
//      ]
    });
    toast.present();
  }

  //----------------------------------------------
  // Exibe mensagem para validação do cartão 
  //----------------------------------------------
  async apresentarEquipe() {
        const alert = await this.alertCtrl.create({
          header: 'MBA Engenharia de Software (Turma 1AOJO)',
          subHeader: 'Componentes do grupo',
          message: '<ion-list><ion-item><ion-avatar slot="end"><img src="./assets/gisele.png"></ion-avatar><ion-label><h3>Gisele Niero Scaramel</h3><p>RM 333956</p></ion-label></ion-item><ion-item><ion-avatar slot="end"><img src="./assets/marcelo.png"></ion-avatar><ion-label><h3>Marcelo Gomes Correia</h3><p>RM 333804</p></ion-label></ion-item><ion-item><ion-avatar slot="end"><img src="./assets/soraya.png"></ion-avatar><ion-label><h3>Soraya Vieira Cardoso Alves</h3><p>RM 333278</p></ion-label></ion-item>',
          buttons: [
         {
              text: 'Ok',
              handler: () => {
              }
            }
          ]
        });
        await alert.present();
      }

}