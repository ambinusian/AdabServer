-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2019 at 09:42 AM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adabtoco`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses_transaction`
--

CREATE TABLE `courses_transaction` (
  `transaction_Id` int(11) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `class_code` varchar(5) CHARACTER SET utf8 NOT NULL,
  `class_type` varchar(4) CHARACTER SET utf8 NOT NULL,
  `class_icon` int(2) NOT NULL,
  `session` varchar(5) NOT NULL,
  `topic` varchar(250) NOT NULL,
  `transaction_date` date NOT NULL,
  `transaction_time` time NOT NULL,
  `is_done` tinyint(4) NOT NULL,
  `is_live` tinyint(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses_transaction`
--

INSERT INTO `courses_transaction` (`transaction_Id`, `course_code`, `class_code`, `class_type`, `class_icon`, `session`, `topic`, `transaction_date`, `transaction_time`, `is_done`, `is_live`) VALUES
(1, 'MOBI6002', 'LA03', 'LEC', 1, '1', 'Introduction to Java Programming', '2019-08-09', '11:20:00', 0, 0),
(2, 'MOBI6002', 'LA03', 'LEC', 2, '2', 'Basic Concept Object-Oriented Programming', '2019-08-16', '11:20:00', 0, 0),
(3, 'COMP6106', 'LZ26', 'LEC', 3, '1', 'Introduction to Refactoring', '2019-08-09', '13:20:00', 0, 0),
(4, 'COMP6106', 'LZ26', 'LEC', 4, '2', 'Introduction to Refactoring', '2019-08-09', '15:20:00', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lecture_transaction`
--

CREATE TABLE `lecture_transaction` (
  `lecture_transaction_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `student_code` varchar(10) NOT NULL,
  `lecturer_code` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lecture_transaction`
--

INSERT INTO `lecture_transaction` (`lecture_transaction_id`, `transaction_id`, `student_code`, `lecturer_code`) VALUES
(1, 1, '1100061092', 'D4524'),
(2, 2, '1100061092', 'D4524'),
(3, 3, '2101656225', 'D3695'),
(4, 4, '2101656225', 'D3695');

-- --------------------------------------------------------

--
-- Table structure for table `master_course`
--

CREATE TABLE `master_course` (
  `course_code` varchar(10) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `streaming` varchar(100) NOT NULL,
  `language` varchar(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `master_course`
--

INSERT INTO `master_course` (`course_code`, `course_name`, `streaming`, `language`) VALUES
('COMP6106', 'Code Reengineering', 'Computer Science Program', 'EN'),
('MOBI6002', 'Mobile Object Oriented Programming', 'Mobile Application & Technology', 'ID');

-- --------------------------------------------------------

--
-- Table structure for table `master_user`
--

CREATE TABLE `master_user` (
  `username` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `department` varchar(100) CHARACTER SET utf8 NOT NULL,
  `privilege` tinyint(2) NOT NULL,
  `tokenid` varchar(20) NOT NULL,
  `lastlogin` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `master_user`
--

INSERT INTO `master_user` (`username`, `name`, `password`, `department`, `privilege`, `tokenid`, `lastlogin`) VALUES
('D4524', 'Sonya Rapinta Manalu', 'c371a08b96ae6b5a1077215b92db4150', 'Mobile Application & Technology', 1, '', '2019-08-08 05:54:07'),
('1100061092', 'Sonya Rapinta Manalu', '4ff579ca7fae7a271e1f86cffb2ca5e8', 'Mobile Application & Technology', 2, 'gcvWaGPZiIbEQrLuoMTt', '2019-08-08 05:55:35'),
('D3695', 'Arthur Salomo Gultom', 'c371a08b96ae6b5a1077215b92db4150', 'Industrial Engineering', 1, '5AZ5PnOr0U4B2QgJrfCj', '2019-08-08 06:41:15'),
('2101656225', 'HANSEN DJUMARI', '4ff579ca7fae7a271e1f86cffb2ca5e8', 'Cyber Security', 2, 'lGdlATfJIvjjm9ZhXoP5', '2019-08-08 06:42:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses_transaction`
--
ALTER TABLE `courses_transaction`
  ADD PRIMARY KEY (`transaction_Id`);

--
-- Indexes for table `lecture_transaction`
--
ALTER TABLE `lecture_transaction`
  ADD PRIMARY KEY (`lecture_transaction_id`);

--
-- Indexes for table `master_course`
--
ALTER TABLE `master_course`
  ADD PRIMARY KEY (`course_code`);

--
-- Indexes for table `master_user`
--
ALTER TABLE `master_user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses_transaction`
--
ALTER TABLE `courses_transaction`
  MODIFY `transaction_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lecture_transaction`
--
ALTER TABLE `lecture_transaction`
  MODIFY `lecture_transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
