
var
au=149597870700,//m
pc=3.26163344,//ly
re=6378100,//m
ld=384400e3,//m
lr=1737.10e3;//m

module.exports={
  blueprints:{
    stationtest:{
      station:true,
      armor:500,
      shield:5000
    },
    asteroid:{
      armor:500,
      shield:0
    }
  },
  systems:{
    sol:{
      loadavg:1,
      pos:[0,0,0],
      places:{
        earth:{
          rocky:true,
          r:re,
          pos:[au,0,0],
          places:{
            'iss 2':{
              blueprint:'stationtest',
              pos:[0,-re-431e3,0]
            },
            moon:{
              rocky:true,
              r:lr,
              pos:[ld,0,0]
            }
          }
        },
        jupiter:{
          rocky:false,
          r:69911*1000,
          pos:[5.458104*au,0,0]
        }
      }//bodies
    },
    'alpha centauri':{
      loadavg:0.5,
      pos:[4,0,0],
      places:{
        'alpha centauri Ab':{
          rocky:true,
          r:re*4,
          pos:[au*1.2,0,0],
          places:{
            'alpha station':{
              blueprint:'stationtest',
              pos:[0,ld,0]
            }
          }
        }
      }//bodies
    }
  }
};
