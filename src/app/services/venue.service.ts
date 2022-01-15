import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { VenuesResponse, Country, TerritorialOrganization, TerritorialEntities, RoadType, Week, Schedule, Venue } from '../interfaces/venue-interface';
import { CustomerService } from './customer.service';
import { GlobalDataService } from './global-data.service';
// import * as moment from 'moment';
// import 'moment/locale/es';


@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private url=this.globalData.getUrlServer();
  private lang=this.globalData.getUserLanguage();
  private user=this.globalData.getUserId();

  constructor(private http:HttpClient,
    private customerServices:CustomerService,
    private globalData:GlobalDataService) { }

  getVenues(userId:string|null):Observable<VenuesResponse>{

    const usuario=!userId?this.user:userId;
    return this.http.get<VenuesResponse>(`${this.url}/venuesandsitesbyuser/${usuario}/${this.lang}`);
  }
  getVenueAndSiteById(id:string):Observable<VenuesResponse>{
    return this.http.get<VenuesResponse>(`${this.url}/venueandsitesbyid/${id}/${this.user}/${this.lang}`);                                                  
  }
  getVenueById(id:string):Observable<VenuesResponse>{
    return this.http.get<VenuesResponse>(`${this.url}/venuebyid/${id}/${this.user}/${this.lang}`);                                                  
  }
  saveVenue(venue:Venue):Observable<any>{
    return this.http.post(`${this.url}/venues/`,venue); 
  }
  updateVenue(venue:Venue):Observable<any>{
    return this.http.put(`${this.url}/venues/`,venue);
  }
  deleteVenue(id:string):Observable<any>{
    return this.http.delete(`${this.url}/venues/${id}`);
  }

  getTerritorialOrganization(country:number):Observable<TerritorialOrganization[]>{
    return this.http.get<any>(`${this.url}/territorialorganization/${country}/${this.lang}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(territorialOrganization=>{
          return territorialOrganization
      })
    )
  }

  
  getTerritorialEntities(territorialOrganization:number,territorialEntity:number):Observable<TerritorialEntities[]>{
    
    return this.http.get<any>(`${this.url}/territorialEntities/${territorialOrganization}/${this.lang}/${territorialEntity}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(territorialEntities=>{
          return territorialEntities
      })
    )
  }

  getCountries():Observable<Country[]>{
    return this.http.get<any>(`${this.url}/countries/${this.lang}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(paises=>{
          return paises
      })
    )
  }
  getRoadTypes():Observable<RoadType[]>{
    return this.http.get<any>(`${this.url}/roadtypes/${this.lang}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(tiposVia=>{
          return tiposVia
      })
    )
  }
  
  getWeek():Observable<Week[]>{
    // moment.locale('es');

    return this.http.get<any>(`${this.url}/weekdays/${this.lang}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(week=>{
          return week
      })
    )
  }

  getMonthsLicenses(){
    return this.http.get<any>(`${this.url}/durationlicenses`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
            return resp.data
        else 
            return []
      }),
      map(months=>{
          return months
      })
    )

  }

  getSchedules(customer:number):Observable<Schedule[]>{
    return this.http.get<any>(`${this.url}/schedules/${customer}/${this.lang}`)
    .pipe(
      map (resp=>{
        if (resp.result===true)
          return resp.data
        else 
            return []
      }),
      map(scheduler=>{
          return scheduler
      })
    )
  }

// Validadores
  
  wrongStartDay(control:FormControl):{[s:string]:boolean}{
  
 
    const diaInicio = control.value;
    let diaCorrecto:boolean=false;
    let meses30Dias = new Array(4,6,9,11);
    let meses31Dias = new Array(1,3,5,7,8,10,12);
  

    if (diaInicio && !isNaN(diaInicio) && diaInicio.length===4){
     
      let dia:number = parseInt(diaInicio.slice(0,2),10);
      let mes:number = parseInt(diaInicio.slice(2,4),10);

      if ((mes>0 && mes<=12) && (dia>0 && dia<=31)){ 
       
        if ((meses31Dias.includes(mes) && dia<=31) || 
            ( meses30Dias.includes(mes) && dia<=30)) {
          diaCorrecto=true; 
        }else if (dia<=29)  diaCorrecto=true; 
      }
      return diaCorrecto?null:{ wrongStartDay:true }
    }

    return
  }

}
