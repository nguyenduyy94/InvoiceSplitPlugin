export class VNDReader
{
    doc1so(so)
    {
        var arr_chuhangdonvi=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var resualt='';
        resualt=arr_chuhangdonvi[so];
        return resualt;
    }
    doc2so(so)
    {
        so=so.replace(' ','');
        var arr_chubinhthuong=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var arr_chuhangdonvi=['mươi','mốt','hai','ba','bốn','lăm','sáu','bảy','tám','chín'];
        var arr_chuhangchuc=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi'];
        var resualt='';
        var sohangchuc=so.substr(0,1);
        var sohangdonvi=so.substr(1,1);
        resualt+=arr_chuhangchuc[sohangchuc];
        if(sohangchuc==1&&sohangdonvi==1)
            resualt+=' '+arr_chubinhthuong[sohangdonvi];
        else if(sohangchuc==1&&sohangdonvi>1)
            resualt+=' '+arr_chuhangdonvi[sohangdonvi];
        else if(sohangchuc>1&&sohangdonvi>0)
            resualt+=' '+arr_chuhangdonvi[sohangdonvi];

        return resualt;
    }
    doc3so(so)
    {
        var resualt='';
        var arr_chubinhthuong=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var sohangtram=so.substr(0,1);
        var sohangchuc=so.substr(1,1);
        var sohangdonvi=so.substr(2,1);
        resualt=arr_chubinhthuong[sohangtram]+' trăm';
        if(sohangchuc==0&&sohangdonvi!=0)
            resualt+=' linh '+arr_chubinhthuong[sohangdonvi];
        else if(sohangchuc!=0)
            resualt+=' '+this.doc2so(sohangchuc+' '+sohangdonvi);
        return resualt;
    }

    docsonguyen(so)
    {

        var result='';
        if(so!=undefined)
        {
            //alert(so);
            var arr_So=[{ty:''},{trieu:''},{nghin:''},{tram:''}];
            var sochuso=so.length;
            for(var i=(sochuso-1);i>=0;i--)
            {

                if((sochuso-i)<=3)
                {
                    if(arr_So['tram']!=undefined)
                        arr_So['tram']=so.substr(i,1)+arr_So['tram'];
                    else arr_So['tram']=so.substr(i,1);

                }
                else if((sochuso-i)>3&&(sochuso-i)<=6)
                {
                    if(arr_So['nghin']!=undefined)
                        arr_So['nghin']=so.substr(i,1)+arr_So['nghin'];
                    else arr_So['nghin']=so.substr(i,1);
                }
                else if((sochuso-i)>6&&(sochuso-i)<=9)
                {
                    if(arr_So['trieu']!=undefined)
                        arr_So['trieu']=so.substr(i,1)+arr_So['trieu'];
                    else arr_So['trieu']=so.substr(i,1);
                }
                else
                {
                    if(arr_So.ty!=undefined)
                        arr_So.ty=so.substr(i,1)+arr_So.ty;
                    else arr_So.ty=so.substr(i,1);
                }
                //console.log(arr_So);
            }

            if(arr_So['ty']>0)
                result+=this.doc(arr_So['ty'])+' tỷ';
            if(arr_So['trieu']>0)
            {
                if(arr_So['trieu'].length>=3||arr_So['ty']>0)
                    result+=' '+this.doc3so(arr_So['trieu'])+' triệu';
                else if(arr_So['trieu'].length>=2)
                    result+=' '+this.doc2so(arr_So['trieu'])+' triệu';
                else result+=' '+this.doc1so(arr_So['trieu'])+' triệu';
            }
            if(arr_So['nghin']>0)
            {
                if(arr_So['nghin'].length>=3||arr_So['trieu']>0)
                    result+=' '+this.doc3so(arr_So['nghin'])+' nghìn';
                else if(arr_So['nghin'].length>=2)
                    result+=' '+this.doc2so(arr_So['nghin'])+' nghìn';
                else result+=' '+this.doc1so(arr_So['nghin'])+' nghìn';
            }
            if(arr_So['tram']>0)
            {
                if(arr_So['tram'].length>=3||arr_So['nghin']>0)
                    result+=' '+this.doc3so(arr_So['tram']);
                else if(arr_So['tram'].length>=2)
                    result+=' '+this.doc2so(arr_So['tram']);
                else result+=' '+this.doc1so(arr_So['tram']);
            }
        }
        return result;
    }

    doc(so)
    {
        var kytuthapphan=",";
        var result='';
        if(so!=undefined)
        {
            so=" "+so+" ";
            so=so.trim();
            var cautrucso=so.split(kytuthapphan);
            if(cautrucso[0]!=undefined)
            {
                result+=this.docsonguyen(cautrucso[0]);
            }
            if(cautrucso[1]!=undefined)
            {
                //alert(this.docsonguyen(cautrucso[1]));
                result+=' phẩy '+ this.docsonguyen(cautrucso[1]);
            }
        }

        return result;
    }
}