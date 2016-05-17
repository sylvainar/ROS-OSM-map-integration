<?php
function decodeValue($value) {
        $index = 0;
        $points = array();
        $lat = 0;
        $lng = 0;
        while ($index < strlen($value)) {
            $b;
            $shift = 0;
            $result = 0;
            do {
                $b = ord(substr($value, $index++, 1)) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b > 31);
            $dlat = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lat += $dlat;
            $shift = 0;
            $result = 0;
            do {
                $b = ord(substr($value, $index++, 1)) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b > 31);
            $dlng = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lng += $dlng;
            $points[] = array('x' => $lat/100000, 'y' => $lng/100000);
        }
        return $points;
    }

echo json_encode(decodeValue('{{ohjAppjSil@qT_T{Nd}AfQxLtArFt@hC^jGrAr@dFbBlEe@xIkAfGWxAs@nD_TdhA]fBor@jrDWz@kAjGw]djBW`AiBnJa\\bdBGl@qBxJiSteAgHf_@O`A{A~HcAzEW`BMl@gNps@_D~PiCbM_Onx@aGfKgEvRaB`CiCbAiBYcL}ByWqJ}c@sP_T_I]OuEaF]aAm@g@sAS{F?iGaCcG{C]u@m@k@m@Qu@Fe@P}Ic@yBy@bF{WFwC}@mDUiDjAeGvNgu@rAoBvCkN'));
?>