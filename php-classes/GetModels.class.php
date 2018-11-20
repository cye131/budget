<?php
class dataPipe {

	public function __construct (array $sourceInOutArr) {
		$this->pipeObj = $sourceInOutArr;
		
		//array of individual [.api.php filename, inputs(assoc_array)]
		if ( count($sources)!=count($inputs) || count($sources)!=count($inputs) || count($sources)!=count($outputs) ) throw("Error");
		
	}
	
	public function getAllData (array $data_to_return) {
		if (count($this->sources) == 0) return ($data = NULL);
			
		$sql = new MyPDO();
		foreach ($this->sources as $m) {
			require_once(__DIR__."/../php-api/{$m[0]}.api.php");
		
		}

		$data
		
		return ($data);
	}
	
	
	
	
	
	










}	