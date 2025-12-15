import 'dart:convert';
import 'package:http/http.dart' as http;

class Api {
  static const base = String.fromEnvironment('SJ_API_URL', defaultValue: 'http://10.0.2.2:3000');

  static Future<Map<String, dynamic>?> register(String name, String email, String password, String cpf) async {
    final res = await http.post(Uri.parse('$base/users/register'), headers: {'Content-Type': 'application/json'}, body: jsonEncode({'name': name, 'email': email, 'password': password, 'cpf': cpf}));
    try {
      return jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  static Future<Map<String, dynamic>?> login(String email, String password) async {
    final res = await http.post(Uri.parse('$base/users/login'), headers: {'Content-Type': 'application/json'}, body: jsonEncode({'email': email, 'password': password}));
    try {
      return jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }
}
