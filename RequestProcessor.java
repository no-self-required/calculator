import java.io.*;
import java.net.Socket;

import org.json.JSONObject;

class RequestProcessor implements Runnable {
  private Socket socket = null;
  private OutputStream os = null;
  private BufferedReader in = null;
  private DataInputStream dis = null;
  private String msgToClient = "HTTP/1.1 200 OK\n" + "Server: HTTP server/0.1\n"
      + "Access-Control-Allow-Origin: *\n\n";
  private JSONObject jsonObject = new JSONObject();

  public RequestProcessor(Socket Socket) {
    super();
    try {
      socket = Socket;
      in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
      os = socket.getOutputStream();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void run() {
    String queryString;
    try {
      queryString = in.readLine();

      String leftOperand = "";
			String rightOperand = "";
			boolean isRightOpComplete = false;
			boolean isLeftOpComplete = false;
      int rightOpIndex = 0;
			char operation = 'x';

      //Extract operands and operation from query
			for (int i = 17; i < queryString.length(); i++) {

				if (!isLeftOpComplete && queryString.charAt(i) == '&') {
					leftOperand = queryString.substring(17, i);
          isLeftOpComplete = true;
          i += 14;
          rightOpIndex = i;
				}

				if (!isRightOpComplete && isLeftOpComplete && queryString.charAt(i) == '&') {
					rightOperand = queryString.substring(rightOpIndex, i);
          isRightOpComplete = true;
				}

				if (isLeftOpComplete && isRightOpComplete && queryString.charAt(i) == '=') { 
					operation = queryString.charAt(i+1);
				}
			}
      

      //calculate result based on operation type
			float result = 0;
      switch(operation) {
        case '+':
          result = Float.parseFloat(leftOperand) + Float.parseFloat(rightOperand);
          break;
        case '-':
          result = Float.parseFloat(leftOperand) - Float.parseFloat(rightOperand);
          break;
        case '*':
          result = Float.parseFloat(leftOperand) * Float.parseFloat(rightOperand);
          break;  
        case '/':
          result = Float.parseFloat(leftOperand) / Float.parseFloat(rightOperand);
          break;    
        case '%':
          result = Float.parseFloat(leftOperand) % Float.parseFloat(rightOperand);
          break;    
        default:
          break;
      }

      //set JSON response
			jsonObject.put("Expression", leftOperand + operation + rightOperand);
			jsonObject.put("Result", result);
    } catch (IOException e ){
      e.printStackTrace();
    }
    try {
      String response = msgToClient + jsonObject.toString();
      os.write(response.getBytes());
      os.flush();
      socket.close();
    } catch(IOException e ){
      e.printStackTrace();
    }
  }
}


