<?php
class MyPDO extends PDO {    
    
    public function __construct() {
        require_once(__DIR__.'/../config/db.php');
        
        $dsn = 'mysql:dbname='.DB_DATABASE;
        $username = DB_USER;
        $password = DB_PASSWORD;
        $driver_options = null;
        
        parent :: __construct($dsn, $username, $password, $driver_options);
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $this->successRowsChanged = (int) 0;
        $this->success = (bool) FALSE;
    }
    
    public function selectToAssoc($query,$valuesToBind,$assocIndex) {
        /*
        $assocIndex tells the final associative array what index to use - leave empty for a 0,1,2,... index; otherwise use the SQL column name to be used (e.g. "id") 
        e.g. $series = $sql -> selectAssoc('hist_fred',['*'],['code','date'],'ORDER BY date ASC'); tells assocIndex to a 3-dimensional array with code indexing dim2 and date indexing dim3
        
        $valuesToBind gives the values to be bound to the ?'s or :'s in the query -
        note that ?'s automatically imply numerical indices (starting from 0)
        whereas :colname requires named index colname        
        */
        
        $stmt = $this->prepare($query);
        //Explicit binding
        if (isset($valuesToBind) && is_array($valuesToBind) && count($valuesToBind) > 0 ) {
            foreach ($valuesToBind as $k=>$v) {
                if (is_int($k)) $b = $k + 1;
                elseif (is_string($k)) $b = ':'.$k;
                $stmt->bindValue($b,$v);
            }
        
        }
        
        $stmt->execute();
        
        $data = array();
        
        //If assocIndex is single-element, return a 2-dimensional array:
        if (!isset($assocIndex) || is_string($assocIndex) || count($assocIndex) === 1) {
            if (is_array($assocIndex)) $assocIndex = (string) $assocIndex[0];
            
            
            $i = (int) 0;
            if (isset($assocIndex) && strlen($assocIndex) > 0 ) $use_assoc = (bool) TRUE;
            else $use_assoc = (bool) FALSE;
    
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if ($use_assoc === TRUE && isset($row[$assocIndex])) $index = $row[$assocIndex];
                else $index = &$i;
                
                $data[$index] = array();
                
                foreach ($row as $k=>$v) {
                    $data[$index][$k] = $v;
                }
                
                $i++;
            }
            
        } elseif (count($assocIndex) == 2) {
        //if assocIndex is 2-dimensional, make a 3-dimensional array:
        
            $i = array();
            $use_assoc = array();
            $index = array();
            
            for ($n=0;$n<count($assocIndex);$n++) {
                if (isset($assocIndex[$n]) && strlen($assocIndex[$n]) > 0 ) $use_assoc[$n] = (bool) TRUE;
                else $use_assoc[$n] = (bool) FALSE;
                $i[$n] = (int) 0;
            }
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                
                for ($n=0;$n<count($assocIndex);$n++) {
                    if ($use_assoc[$n] === TRUE && isset($row[$assocIndex[$n]])) $index[$n] = $row[$assocIndex[$n]];
                    else $index[$n] = &$i;
                                        
                    if ($n === 1) $data[$index[0]][$index[1]] = array();                    
                }
                
                
                foreach ($row as $k=>$v) {
                    $data[$index[0]][$index[1]][$k] = $v;
                }
                
            }
            
        } else {
            return 'Too many items in function argument $assocIndex';
        }
        
        
        return $data;
        
    }
    
    
    public function multipleInsert($tblName,$colNames,$dataVals) {
        //modified from https://stackoverflow.com/a/4559320
        
        // setup data values for PDO
        // memory warning: this is creating a copy all of $dataVals
        $dataToInsert = array();
        
        foreach ($dataVals as $row => $data) {
            foreach($data as $val) {
                $dataToInsert[] = $val;
            }
        }
        
        // (optional) setup the ON DUPLICATE column names
        $updateCols = array();
        
        foreach ($colNames as $curCol) {
            $updateCols[] = $curCol . " = VALUES($curCol)";
        }
        $onDup = implode(', ', $updateCols);
        
        // setup the placeholders - a fancy way to make the long "(?, ?, ?)..." string
        $rowPlaces = '(' . implode(', ', array_fill(0, count($colNames), '?')) . ')';
        $allPlaces = implode(', ', array_fill(0, count($dataVals), $rowPlaces));
        
        $this->beginTransaction();
        
        $sql = "INSERT INTO $tblName (" . implode(', ', $colNames) . 
            ") VALUES " . $allPlaces . " ON DUPLICATE KEY UPDATE $onDup";
        
        //echo $sql;
        // and then the PHP PDO boilerplate
        $stmt = $this->prepare ($sql);
        
        //Explicit binding (unnecessary but here anyways)
        foreach ($dataToInsert as $k=>$v) {
            $stmt->bindValue($k+1,$v);
        }
        
        try {
           $stmt->execute($dataToInsert); //execute automatically binds params 0=>first qmark, 1=>second qmark, etc
           $this->successRowsChanged = $stmt->rowCount();
        } catch (PDOException $e){
           echo $e->getMessage();
        }
        
        $this->commit();
    }
    

	
	
	
    public function delete($query,$valuesToBind) {
        
        $stmt = $this->prepare($query);
        //Explicit binding
        if (isset($valuesToBind) && is_array($valuesToBind) && count($valuesToBind) > 0 ) {
            foreach ($valuesToBind as $k=>$v) {
                if (is_int($k)) $b = $k + 1;
                elseif (is_string($k)) $b = ':'.$k;
                $stmt->bindValue($b,$v);
            }
        
        }
        $stmt->execute();
    }

	
	
	
}

