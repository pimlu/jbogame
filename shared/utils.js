(function() {
  //silly differentiation based on what module system we're using
  if(typeof define==='function') {
    define([],impl);
  } else if(typeof module==='object') {
    module.exports=impl();
  }
  //our actual implementation
  function impl(seedrandom,Noise) {
    var LinkedList=(function() {
      function LLNode(data,prev,next,list) {
        this.d=data;
        this.prev=prev;
        this.next=next;
        this.list=list;
      }
      LLNode.prototype.remove=function() {
        if(!this.prev) this.list.head=this.next;
        else this.prev.next=this.next;
        if(!this.next) this.list.tail=this.prev;
        else this.next.prev=this.prev;
        return this.d;
      };
      LLNode.prototype.addbefore=function(e) {
        var ishead=this.prev===null;
        this.prev=new LLNode(e,this.prev,this,this.list);
        if(ishead) this.list.head=this.prev;
        return this;
      };
      LLNode.prototype.addarrbefore=function(arr,index) {
        for(var i=(index||0);i<arr.length;i++) {
          this.addbefore(arr[i]);
        }
        return this;
      };
      LLNode.prototype.addafter=function(e) {
        var istail=this.next===null;
        this.next=new LLNode(e,this,this.next,this.list);
        if(istail) this.list.tail=this.next;
        return this;
      };
      LLNode.prototype.addarrafter=function(arr,index) {
        for(var i=arr.length-1;i>=(index||0);i--) {
          this.addafter(arr[i]);
        }
        return this;
      };

      function LinkedList(arr) {
        this.head=this.tail=null;
        if(arr) this.pusharr(arr);
      }
      LinkedList.prototype.isempty=function() {
        return this.head===null;
      };
      LinkedList.prototype.iterator=function(start) {
        var cur=start||this.head;
        function dirgen(dir) {
          return function() {
            if(cur) {
              var ret={value:cur.d,done:false};
              cur=cur[dir];
              return ret;
            }
            return {done:true};
          };
        }
        return {
          next:dirgen('next'),
          prev:dirgen('prev')
        };
      };
      LinkedList.prototype.push=function(e) {
        if(this.tail===null) this.head=this.tail=new LLNode(e,null,null,this);
        else this.tail.addafter(e);
      };
      LinkedList.prototype.pusharr=function(arr) {
        if(!arr.length) return;
        if(this.tail===null) this.head=this.tail=new LLNode(arr[0],null,null,this);
        this.head.addarrafter(arr,1);
      };
      LinkedList.prototype.pop=function() {
        if(this.tail) return this.tail.remove();
      };
      LinkedList.prototype.toArray=function() {
        if(!this.head) return [];
        var arr=[this.head.d];
        for(var cur=this.head.next;cur!==null;cur=cur.next) {
          arr.push(cur.d);
        }
        return arr;
      };
      LinkedList.prototype.toString=function() {
        return this.toArray().toString();
      };
      return LinkedList;
    })();
    function Queue() {
      this.list=new LinkedList();
    }
    Queue.prototype.eq=function(v) {
      this.list.push(v);
    };
    Queue.prototype.dq=function() {
      if(this.list.head) return this.list.head.remove();
    };
    Queue.prototype.isempty=function() {
      return this.list.isempty();
    };
    Queue.prototype.iterator=function() {
      var list=this.list;
      return {
        next:function() {
          return list.head?{done:false,value:list.head.remove()}:{done:true};
        }
      };
    };
    //this func applies css rules like an actual css document
    function applycss(e,s) {
      var x=s.split(';').map(
        function(txt){return txt.split(':');}
      );
      if(!x[x.length-1][0]) x.pop();
      x.forEach(function(i){e.css(i[0],i[1]);});
    }
    return {
      LinkedList:LinkedList,
      Queue:Queue,
      applycss:applycss
    };
  }
})();
