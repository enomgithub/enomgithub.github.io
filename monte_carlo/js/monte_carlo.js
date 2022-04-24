/* Generated by the Nim Compiler v0.17.2 */
/*   (c) 2017 Andreas Rumpf */

var framePtr = null;
var excHandler = 0;
var lastJSError = null;
if (typeof Int8Array === 'undefined') Int8Array = Array;
if (typeof Int16Array === 'undefined') Int16Array = Array;
if (typeof Int32Array === 'undefined') Int32Array = Array;
if (typeof Uint8Array === 'undefined') Uint8Array = Array;
if (typeof Uint16Array === 'undefined') Uint16Array = Array;
if (typeof Uint32Array === 'undefined') Uint32Array = Array;
if (typeof Float32Array === 'undefined') Float32Array = Array;
if (typeof Float64Array === 'undefined') Float64Array = Array;
var NTI55016 = {size: 0,kind: 24,base: null,node: null,finalizer: null};
var NTI124 = {size: 0,kind: 36,base: null,node: null,finalizer: null};
var NTI55017 = {size: 0, kind: 18, base: null, node: null, finalizer: null};
var NTI55683 = {size: 0,kind: 24,base: null,node: null,finalizer: null};
var NNI55017 = {kind: 2, len: 2, offset: 0, typ: null, name: null, sons: [{kind: 1, offset: "Field0", len: 0, typ: NTI124, name: "Field0", sons: null}, 
{kind: 1, offset: "Field1", len: 0, typ: NTI124, name: "Field1", sons: null}]};
NTI55017.node = NNI55017;
NTI55683.base = NTI55017;
NTI55016.base = NTI55017;

function toJSStr(s_15003) {
		    var len = s_15003.length-1;
    var asciiPart = new Array(len);
    var fcc = String.fromCharCode;
    var nonAsciiPart = null;
    var nonAsciiOffset = 0;
    for (var i = 0; i < len; ++i) {
      if (nonAsciiPart !== null) {
        var offset = (i - nonAsciiOffset) * 2;
        var code = s_15003[i].toString(16);
        if (code.length == 1) {
          code = "0"+code;
        }
        nonAsciiPart[offset] = "%";
        nonAsciiPart[offset + 1] = code;
      }
      else if (s_15003[i] < 128)
        asciiPart[i] = fcc(s_15003[i]);
      else {
        asciiPart.length = i;
        nonAsciiOffset = i;
        nonAsciiPart = new Array((len - i) * 2);
        --i;
      }
    }
    asciiPart = asciiPart.join("");
    return (nonAsciiPart === null) ?
        asciiPart : asciiPart + decodeURIComponent(nonAsciiPart.join(""));
  

	
}

function rawEcho() {
		      var buf = "";
      for (var i = 0; i < arguments.length; ++i) {
        buf += toJSStr(arguments[i]);
      }
      console.log(buf);
    

	
}

function makeNimstrLit(c_14603) {
		    var ln = c_14603.length;
    var result = new Array(ln + 1);
    var i = 0;
    for (; i < ln; ++i) {
      result[i] = c_14603.charCodeAt(i);
    }
    result[i] = 0; // terminating zero
    return result;
    

	
}

function cstrToNimstr(c_14803) {
		  var ln = c_14803.length;
  var result = new Array(ln);
  var r = 0;
  for (var i = 0; i < ln; ++i) {
    var ch = c_14803.charCodeAt(i);

    if (ch < 128) {
      result[r] = ch;
    }
    else {
      if (ch < 2048) {
        result[r] = (ch >> 6) | 192;
      }
      else {
        if (ch < 55296 || ch >= 57344) {
          result[r] = (ch >> 12) | 224;
        }
        else {
            ++i;
            ch = 65536 + (((ch & 1023) << 10) | (c_14803.charCodeAt(i) & 1023));
            result[r] = (ch >> 18) | 240;
            ++r;
            result[r] = ((ch >> 12) & 63) | 128;
        }
        ++r;
        result[r] = ((ch >> 6) & 63) | 128;
      }
      ++r;
      result[r] = (ch & 63) | 128;
    }
    ++r;
  }
  result[r] = 0; // terminating zero
  return result;
  

	
}

function setConstr() {
		      var result = {};
      for (var i = 0; i < arguments.length; ++i) {
        var x = arguments[i];
        if (typeof(x) == "object") {
          for (var j = x[0]; j <= x[1]; ++j) {
            result[j] = true;
          }
        } else {
          result[x] = true;
        }
      }
      return result;
    

	
}
var ConstSet1 = setConstr(17, 16, 4, 18, 27, 19, 23, 22, 21);

function nimCopy(dest_19817, src_19818, ti_19819) {
	var result_20229 = null;

		switch (ti_19819.kind) {
		case 21:
		case 22:
		case 23:
		case 5:
			if (!(isFatPointer_19801(ti_19819))) {
			result_20229 = src_19818;
			}
			else {
				result_20229 = [src_19818[0], src_19818[1]];
			}
			
			break;
		case 19:
			      if (dest_19817 === null || dest_19817 === undefined) {
        dest_19817 = {};
      }
      else {
        for (var key in dest_19817) { delete dest_19817[key]; }
      }
      for (var key in src_19818) { dest_19817[key] = src_19818[key]; }
      result_20229 = dest_19817;
    
			break;
		case 18:
		case 17:
			if (!((ti_19819.base == null))) {
			result_20229 = nimCopy(dest_19817, src_19818, ti_19819.base);
			}
			else {
			if ((ti_19819.kind == 17)) {
			result_20229 = (dest_19817 === null || dest_19817 === undefined) ? {m_type: ti_19819} : dest_19817;
			}
			else {
				result_20229 = (dest_19817 === null || dest_19817 === undefined) ? {} : dest_19817;
			}
			}
			nimCopyAux(result_20229, src_19818, ti_19819.node);
			break;
		case 24:
		case 4:
		case 27:
		case 16:
			      if (src_19818 === null) {
        result_20229 = null;
      }
      else {
        if (dest_19817 === null || dest_19817 === undefined) {
          dest_19817 = new Array(src_19818.length);
        }
        else {
          dest_19817.length = src_19818.length;
        }
        result_20229 = dest_19817;
        for (var i = 0; i < src_19818.length; ++i) {
          result_20229[i] = nimCopy(result_20229[i], src_19818[i], ti_19819.base);
        }
      }
    
			break;
		case 28:
			      if (src_19818 !== null) {
        result_20229 = src_19818.slice(0);
      }
    
			break;
		default: 
			result_20229 = src_19818;
			break;
		}

	return result_20229;

}

function nimMin(a_19439, b_19440) {
		var Tmp1;

	var result_19441 = 0;

	BeforeRet: do {
		if ((a_19439 <= b_19440)) {
		Tmp1 = a_19439;
		}
		else {
		Tmp1 = b_19440;
		}
		
		result_19441 = Tmp1;
		break BeforeRet;
	} while (false);

	return result_19441;

}
var nimvm_6119 = false;
var nim_program_result = 0;
var globalRaiseHook_11605 = [null];
var localRaiseHook_11610 = [null];
var outOfMemHook_11613 = [null];
var state_48605 = [{a0: 1773455756, a1: 4275166512}];

function getTime_51042() {
	var result_53413 = 0.0;

	BeforeRet: do {
		result_53413 = new Date();
		break BeforeRet;
	} while (false);

	return result_53413;

}
var startMilsecs_53512 = [getTime_51042()];

function rotl_48802(x_48804, k_48805) {
	var result_48806 = 0;

		result_48806 = ((x_48804 << k_48805) | ((x_48804 >>> 0) >>> ((64 - k_48805) >>> 0)));

	return result_48806;

}

function next_48842(s_48845) {
	var result_48846 = 0;

		var s0_48847 = s_48845.a0;
		var s1_48848 = s_48845.a1;
		result_48846 = ((s0_48847 + s1_48848) >>> 0);
		s1_48848 = (s1_48848 ^ s0_48847);
		s_48845.a0 = ((rotl_48802(s0_48847, 55) ^ s1_48848) ^ (s1_48848 << 14));
		s_48845.a1 = rotl_48802(s1_48848, 36);

	return result_48846;

}

function randomize_49434(seed_49436) {
		state_48605[0].a0 = ((seed_49436 ) >>> 16);
		state_48605[0].a1 = (seed_49436 & 65535);
		next_48842(state_48605[0]);

	
}

function randomize_54001() {
		randomize_49434(getTime_51042().getTime());

	
}

function random_49318(max_49320) {
	var result_49321 = 0.0;

		var x_49323 = next_48842(state_48605[0]);
		result_49321 = ((x_49323 / 4294967295) * max_49320);

	return result_49321;

}

function seqToPtr_55409(x_55414) {
		return x_55414

	
}

function eqeq__55647(x_55651, y_55653) {
	var result_55654 = false;

	BeforeRet: do {
		if (!((x_55651["Field0"] == y_55653["Field0"]))) {
		result_55654 = false;
		break BeforeRet;
		}
		
		if (!((x_55651["Field1"] == y_55653["Field1"]))) {
		result_55654 = false;
		break BeforeRet;
		}
		
		result_55654 = true;
		break BeforeRet;
	} while (false);

	return result_55654;

}

function eqeq__55044(x_55049, y_55052) {
	var result_55053 = false;

	BeforeRet: do {
		if ((seqToPtr_55409(x_55049) == seqToPtr_55409(y_55052))) {
		result_55053 = true;
		break BeforeRet;
		}
		
		if (((x_55049 === null) || (y_55052 === null))) {
		result_55053 = false;
		break BeforeRet;
		}
		
		if (!(((x_55049 != null ? x_55049.length : 0) == (y_55052 != null ? y_55052.length : 0)))) {
		result_55053 = false;
		break BeforeRet;
		}
		
		L1: do {
			var i_55645 = 0;
			var colontmp__55665 = 0;
			colontmp__55665 = ((x_55049 != null ? x_55049.length : 0) - 1);
			var res_55668 = 0;
			L2: do {
					L3: while (true) {
					if (!(res_55668 <= colontmp__55665)) break L3;
						i_55645 = res_55668;
						if (!(eqeq__55647(x_55049[i_55645], y_55052[i_55645]))) {
						result_55053 = false;
						break BeforeRet;
						}
						
						res_55668 += 1;
					}
			} while(false);
		} while(false);
		result_55053 = true;
		break BeforeRet;
	} while (false);

	return result_55053;

}

function isFatPointer_19801(ti_19803) {
	var result_19804 = false;

	BeforeRet: do {
		result_19804 = !((ConstSet1[ti_19803.base.kind] != undefined));
		break BeforeRet;
	} while (false);

	return result_19804;

}

function nimCopyAux(dest_19822, src_19823, n_19825) {
		switch (n_19825.kind) {
		case 0:
			break;
		case 1:
			      dest_19822[n_19825.offset] = nimCopy(dest_19822[n_19825.offset], src_19823[n_19825.offset], n_19825.typ);
    
			break;
		case 2:
			L1: do {
				var i_20215 = 0;
				var colontmp__20217 = 0;
				colontmp__20217 = (n_19825.len - 1);
				var res_20220 = 0;
				L2: do {
						L3: while (true) {
						if (!(res_20220 <= colontmp__20217)) break L3;
							i_20215 = res_20220;
							nimCopyAux(dest_19822, src_19823, n_19825.sons[i_20215]);
							res_20220 += 1;
						}
				} while(false);
			} while(false);
			break;
		case 3:
			      dest_19822[n_19825.offset] = nimCopy(dest_19822[n_19825.offset], src_19823[n_19825.offset], n_19825.typ);
      for (var i = 0; i < n_19825.sons.length; ++i) {
        nimCopyAux(dest_19822, src_19823, n_19825.sons[i][1]);
      }
    
			break;
		}

	
}

function safeAdd_55033(x_55039, x_55039_Idx, y_55041) {
		if (eqeq__55044(x_55039[x_55039_Idx], null)) {
		x_55039[x_55039_Idx] = nimCopy(null, [y_55041], NTI55683);
		}
		else {
			var Tmp1 = nimCopy(null, y_55041, NTI55017);
		if (x_55039[x_55039_Idx] != null) { x_55039[x_55039_Idx].push(Tmp1); } else { x_55039[x_55039_Idx] = [Tmp1]; };
		}
		

	
}

function getPoints_55009(n_55011, max_55012) {
	var result_55015 = null;

	BeforeRet: do {
		randomize_54001();
		var points_55018 = [null];
		L1: do {
			var i_55028 = 0;
			var i_55701 = 0;
			L2: do {
					L3: while (true) {
					if (!(i_55701 < n_55011)) break L3;
						i_55028 = i_55701;
						var x_55029 = random_49318(max_55012);
						var y_55030 = random_49318(max_55012);
						safeAdd_55033(points_55018, 0, {Field0: x_55029, Field1: y_55030});
						i_55701 += 1;
					}
			} while(false);
		} while(false);
		result_55015 = nimCopy(null, points_55018[0], NTI55016);
		break BeforeRet;
	} while (false);

	return result_55015;

}

function isContained_55001(x_55003, y_55004, threshold_55005) {
		var Tmp1;

	var result_55006 = false;

	BeforeRet: do {
		var distance_55007 = (Math.sqrt((1.0000000000000000e+000 + ((y_55004 * y_55004) / (x_55003 * x_55003)))) * x_55003);
		if ((distance_55007 <= threshold_55005)) {
		Tmp1 = true;
		}
		else {
		Tmp1 = false;
		}
		
		result_55006 = Tmp1;
		break BeforeRet;
	} while (false);

	return result_55006;

}

function monteCarlo_55703(n_55705) {
	var result_55706 = 0.0;

	BeforeRet: do {
		var points_55709 = getPoints_55009(n_55705, 1.0000000000000000e+000);
		var count_55710 = 0;
		L1: do {
			var i_55720 = 0;
			var i_55735 = 0;
			L2: do {
					L3: while (true) {
					if (!(i_55735 < n_55705)) break L3;
						i_55720 = i_55735;
						if (isContained_55001(points_55709[i_55720]["Field0"], points_55709[i_55720]["Field1"], 1.0000000000000000e+000)) {
						count_55710 += 1;
						}
						
						i_55735 += 1;
					}
			} while(false);
		} while(false);
		result_55706 = ((4.0000000000000000e+000 * count_55710) / n_55705);
		break BeforeRet;
	} while (false);

	return result_55706;

}

function main_55784() {
		rawEcho(makeNimstrLit("Pi = "), cstrToNimstr((monteCarlo_55703(1000000))+""));

	
}
if (false) {
main_55784();
}

var count_56001 = [0];

function monteCarlo_55737(points_55741) {
	var result_55742 = 0.0;

	BeforeRet: do {
		var count_55743 = 0;
		L1: do {
			var i_55760 = 0;
			var colontmp__55779 = 0;
			colontmp__55779 = (points_55741 != null ? points_55741.length : 0);
			var i_55782 = 0;
			L2: do {
					L3: while (true) {
					if (!(i_55782 < colontmp__55779)) break L3;
						i_55760 = i_55782;
						if (isContained_55001(points_55741[i_55760]["Field0"], points_55741[i_55760]["Field1"], 1.0000000000000000e+000)) {
						count_55743 += 1;
						}
						
						i_55782 += 1;
					}
			} while(false);
		} while(false);
		result_55742 = ((4.0000000000000000e+000 * count_55743) / (points_55741 != null ? points_55741.length : 0));
		break BeforeRet;
	} while (false);

	return result_55742;

}

function getContext2D_46513(c_46515) {
	var result_46516 = null;

		result_46516=c_46515.getContext('2d');

	return result_46516;

}

function fillStyleeq__46089(ctx_46091, color_46092) {
		ctx_46091.fillStyle=color_46092;

	
}

function cls_56017(canvas_56019) {
		var ctx_56020 = getContext2D_46513(canvas_56019);
		var width_56021 = canvas_56019.width;
		var height_56022 = canvas_56019.height;
		fillStyleeq__46089(ctx_56020, "#302833");
		ctx_56020.fillRect(0.0, 0.0, width_56021, height_56022);

	
}

function draw_56003(canvas_56005, point_56007) {
		var Tmp1;

		var ctx_56008 = getContext2D_46513(canvas_56005);
		var width_56009 = canvas_56005.width;
		var height_56010 = canvas_56005.height;
		var x_56011 = (point_56007["Field0"] * width_56009);
		var y_56012 = (height_56010 - (point_56007["Field1"] * height_56010));
		if (isContained_55001(point_56007["Field0"], point_56007["Field1"], 1.0000000000000000e+000)) {
		Tmp1 = makeNimstrLit("#eb6101");
		}
		else {
		Tmp1 = makeNimstrLit("#38a1db");
		}
		
		fillStyleeq__46089(ctx_56008, toJSStr(Tmp1));
		ctx_56008.beginPath();
		ctx_56008.arc(x_56011, y_56012, 2.0000000000000000e+000, 0.0, 6.2831853071795862e+000, true);
		ctx_56008.fill();

	
}

function loop_56026(canvas_56028, points_56031) {
		draw_56003(canvas_56028, points_56031[count_56001[0]]);
		if ((((points_56031 != null ? points_56031.length : 0) - 1) <= count_56001[0])) {
		count_56001[0] = 0;
		cls_56017(canvas_56028);
		}
		else {
		count_56001[0] += 1;
		}
		

	
}

function resize_56048(canvas_56050, maxwidth_56051, points_56054) {
		canvas_56050.width = nimMin(maxwidth_56051, window.innerWidth);
		canvas_56050.height = nimMin(maxwidth_56051, window.innerWidth);
		cls_56017(canvas_56050);
		L1: do {
			var i_56064 = 0;
			var i_56068 = 0;
			L2: do {
					L3: while (true) {
					if (!(i_56068 < count_56001[0])) break L3;
						i_56064 = i_56068;
						draw_56003(canvas_56050, points_56054[i_56064]);
						i_56068 += 1;
					}
			} while(false);
		} while(false);

	
}

function init_56070() {

		function colonanonymous__56086() {
				loop_56026(canvas_56084, points_56083);

			
		}

		function colonanonymous__56089(e_56091) {
				resize_56048(canvas_56084, 600, points_56083);

			
		}

		var width_56079 = nimMin(600, window.innerWidth);
		var height_56080 = nimMin(600, window.innerWidth);
		var points_56083 = getPoints_55009(10000, 1.0000000000000000e+000);
		var canvas_56084 = document.getElementById("monte-carlo");
		canvas_56084.width = width_56079;
		canvas_56084.height = height_56080;
		document.getElementById("pi").innerHTML = toJSStr((makeNimstrLit("Pi = ").slice(0,-1)).concat(cstrToNimstr((monteCarlo_55737(points_56083))+"")));
		cls_56017(canvas_56084);
		var timer_56088 = window.setInterval(colonanonymous__56086, 1);
		window.addEventListener("resize", colonanonymous__56089, false);

	
}
if (true) {
init_56070();
}
