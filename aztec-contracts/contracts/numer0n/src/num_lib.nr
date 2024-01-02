    fn is_valid_nums(_num: Field) {
        assert(_num as u16 >= 12, "number should be bigger than 11");
        assert(_num as u16 <= 987, "number should be lower than 988");

        let mut num = _num as u16;
        let mut modulus: u16 = 100;
        let mut nums: [u16;3] = [0;3];

        for i in 0..3 {
            if ((i == 0) & (num < 100)) {
                nums[i] = 0 as u16;
            } else {
               let subtractor = num - (num % modulus);
               nums[i] = subtractor / modulus;
               num = num - subtractor;
            }

            modulus = modulus / 10;
        }

        assert((nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0]), "duplication not allowed");
        assert((nums[0] < 10) & (nums[1] < 10) & (nums[2] < 10), "nums should be less than 10");
    }

    fn check_result(
        _call_num: Field, 
        _secret_num: Field,
    ) -> [Field;2] {

        let mut call_num = _call_num as u16;
        let mut secret_num = _secret_num as u16;

        let mut modulus: u16 = 100;
        let mut call_nums: [u16;3] = [0;3];
        let mut secret_nums: [u16;3] = [0;3];


        for i in 0..3 {
            if ((i == 0) & (call_num < 100)) {
                call_nums[i] = 0 as u16;
            } else {
               let subtractor = call_num - (call_num % modulus);
               call_nums[i] = subtractor / modulus;
               call_num = call_num - subtractor;
            }

            modulus = modulus / 10;
        }

        modulus = 100;

        for i in 0..3 {
            if ((i == 0) & (secret_num < 100)) {
                secret_nums[i] = 0 as u16;
            } else {
               let subtractor = secret_num - (secret_num % modulus);
               secret_nums[i] = subtractor / modulus;
               secret_num = secret_num - subtractor;
            }

            modulus = modulus / 10;
        }

        let mut ret: [Field;2] = [0;2];

        for i in 0..3 {
            
            for j in 0..3 {

                   if (i == j) & (call_nums[i] == secret_nums[j]) {
                    ret[0] = (ret[0] + 1) as Field;
                   } 

                   if (i != j) & (call_nums[i] == secret_nums[j]) {
                    ret[1] = (ret[1] + 1) as Field;
                   }
            }
        }

        ret
    }

    pub fn _is_valid_nums(_num: Field) -> [u16;3] {
        assert(_num as u16 >= 12, "number should be bigger than 11");
        assert(_num as u16 <= 987, "number should be lower than 988");

        let mut num = _num as u16;
        let mut modulus: u16 = 100;
        let mut nums: [u16;3] = [0;3];

        for i in 0..3 {
            if ((i == 0) & (num < 100)) {
                nums[i] = 0 as u16;
            } else {
               let subtractor = num - (num % modulus);
               nums[i] = subtractor / modulus;
               num = num - subtractor;
            }

            modulus = modulus / 10;
        }

        assert((nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0]), "duplication not allowed");
        assert((nums[0] < 10) & (nums[1] < 10) & (nums[2] < 10), "nums should be less than 10");

        nums
    }

    pub fn _check_result(
        _call_num: Field, 
        _secret_num: Field,
    ) -> [Field;2] {

        let mut call_num = _call_num as u16;
        let mut secret_num = _secret_num as u16;

        let mut modulus: u16 = 100;
        let mut call_nums: [u16;3] = [0;3];
        let mut secret_nums: [u16;3] = [0;3];

        
        for i in 0..3 {
            if ((i == 0) & (call_num < 100)) {
                call_nums[i] = 0 as u16;
            } else {
               let subtractor = call_num - (call_num % modulus);
               call_nums[i] = subtractor / modulus;
               call_num = call_num - subtractor;
            }

            modulus = modulus / 10;
        }

        modulus = 100;

        for i in 0..3 {
            if ((i == 0) & (secret_num < 100)) {
                secret_nums[i] = 0 as u16;
            } else {
               let subtractor = secret_num - (secret_num % modulus);
               secret_nums[i] = subtractor / modulus;
               secret_num = secret_num - subtractor;
            }

            modulus = modulus / 10;
        }

        let mut ret: [Field;2] = [0;2];

        for i in 0..3 {
            
            for j in 0..3 {

                   if (i == j) & (call_nums[i] == secret_nums[j]) {
                    ret[0] = (ret[0] + 1) as Field;
                   } 

                   if (i != j) & (call_nums[i] == secret_nums[j]) {
                    ret[1] = (ret[1] + 1) as Field;
                   }
            }
        }

        ret
    }
