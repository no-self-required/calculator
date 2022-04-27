# Calculator

This application contains a front end for displaying a calculator interface for the user, and a backend to perform the requested calculations and return the result for the interface to display.

## Requirements
- OpenJDK 18
- Modern browser (Edge, Chrome, Brave, etc)

## Building Application

### Frontend
The frontend does not need to be built.

### Backend
Run the [compile_java.sh](./compile_java.sh) script to generate the java class files.

```sh
./compile_java.sh
```

## Running Application

### Frontend
The frontend should be viewable by opening the [calculator.html](./calculator.html) page.

### Backend
Run the [run_java.sh](./run_java.sh) script to run the java backend.

```sh
./run_java.sh
```

## Future Work
- Implement backend validation for incoming calculation requests
- Fix edge case when trying to perform a valid calculation after an invalid calculation was performed that caused a state reset, where the app state would desync from the input element state